from app import logger
from errors import NotFoundError, FailedMethodError, BadRequestError
import base64
import time
import os
from astropy.io import fits
from io import BytesIO
from system import settings
from utils.threads import start_thread
import subprocess
import shutil
import re
from static_settings import StaticSettings
import astropy.units as u
from astropy.coordinates import SkyCoord, Angle
from astropy.io import fits
from PIL import Image, UnidentifiedImageError
import numpy as np

class PlateSolving:

    DATAURL_SEPARATOR=';base64,'

    def __init__(self, server, event_listener):
        self.server = server
        self.event_listener = event_listener
        self.status = 'idle'
        self.solver_thread = None
        self.solver_process = None

    def is_available(self):
        return settings.astrometry_solve_field_path and os.path.isfile(settings.astrometry_solve_field_path)

    def to_map(self):
        return {
            'available': self.is_available(),
            'status': self.status,
        }

    def abort(self):
        if self.status != 'solving':
            raise BadRequestError('Solver is not running')
        self.__set_status('abort')
        if self.solver_process and self.solver_process_cancel_file:
            with open(self.solver_process_cancel_file, 'w') as f:
                f.write('abort')
            self.solver_process.wait()
            self.solver_process = None
            if self.solver_thread:
                self.solver_thread.join()
            self.solver_thread = None
        return self.to_map()

    def solve_field(self, options):
        if not self.is_available():
            raise BadRequestError('Astrometry.net solve-field not found in {}'.format(settings.astrometry_solve_field_path))

        self.__set_status('solving')
        if not options['slewTelescope']:
            return self.__start_solver(options)
        else:
            return self.__start_slew_solver(options)

    def __start_slew_solver(self, options):
        if not 'cameraOptions' in options:
            raise BadRequestError('You need to capture from camera when using Slew mode')
        if not 'target' in options:
            raise BadRequestError('You need a target when using Slew mode')
        if not 'telescope' in options:
            raise BadRequestError('You need a telescope when using Slew mode')
        self.solver_thread = start_thread(self.__slew_solver_thread, options)
        return self.to_map()

    def __slew_solver_thread(self, options):
        try:
            from system import controller
            telescope = controller.indi_server.get_telescope(options['telescope'])
            target_coordinates = SkyCoord(ra=options['target']['raj2000'] * u.deg, dec=options['target']['dej2000'] * u.deg, equinox='J2000')
            accuracy = options.get('telescopeSlewAccuracy', 30)
            solution = None

            def is_close_enough():
                if not solution:
                    return False
                solution_dict = dict([(x['name'], x['value']) for x in solution['solution']['values']])
                solution_coordinates = SkyCoord(ra=solution_dict['ASTROMETRY_RESULTS_RA'] * u.deg, dec=solution_dict['ASTROMETRY_RESULTS_DE'] * u.deg, equinox='J2000')
                separation = solution_coordinates.separation(target_coordinates)
                logger.debug('Separation from target: {}'.format(separation.arcmin))
                return separation <= Angle(accuracy * u.arcminute)

            while not is_close_enough() and self.status not in ['aborted', 'error']:
                self.event_listener.on_platesolving_message('Slewing telescope {} to {}'.format(telescope.id, target_coordinates.to_string('hmsdms')))
                telescope.goto({'ra': target_coordinates.ra.hourangle, 'dec': target_coordinates.dec.deg}, equinox='J2000', sync=True)
                solver_options = {}
                solver_options.update(options)
                solver_options.update({ 'sync': True, 'syncTelescope': True, 'internalSkipIdle': True })
                self.event_listener.on_platesolving_message('Starting platesolving')
                solution = self.__start_solver(solver_options)
                if solution['status'] == 'error':
                    break

            self.event_listener.on_platesolving_finished(solution)
        finally:
            self.__set_status('idle')

    def __check_fits_file(self, file):
        try:
            with fits.open(file, mode='readonly'):
                pass
        except OSError:
            return False
        return True

    def __data_to_fits(self, data, temp_path):
        temp_upload_prefix = os.path.join(temp_path, 'solve_field_input')
        fits_file_path = temp_upload_prefix + '.fits'
        with open(temp_upload_prefix, 'wb') as file:
            file.write(data)

        if self.__check_fits_file(temp_upload_prefix):
            shutil.move(temp_upload_prefix, fits_file_path)
        else:
            if not self.__img_to_fits(temp_upload_prefix, fits_file_path, remove=True):
                raise BadRequestError('File is not a FITS nor a recognizable image format')
        return fits_file_path

    def __img_to_fits(self, temp_file, destination, remove=False):
        try:
            logger.debug('Converting image to FITS format')
            img = Image.open(temp_file)
            xsize, ysize = img.size
            data = np.array(img.convert('L').getdata(), dtype=np.uint8).reshape(ysize, xsize)
            fits_file = fits.PrimaryHDU(data=data)
            fits_file.writeto(destination)
            if remove:
                os.remove(temp_file)
            return True
        except UnidentifiedImageError:
            return False

    def __platesolving_options_log(self, options):
        return str(['{}: {}'.format(key, '<blob>' if key == 'fileBuffer' else value)  for key, value in options.items()])


    def __start_solver(self, options):
        temp_path = os.path.join(StaticSettings.ASTROMETRY_TEMP_PATH, 'solve_field_{}'.format(time.time()))
        os.makedirs(temp_path, exist_ok=True)
 
        fits_file_path = None
        logger.debug('Solve field options: %s', self.__platesolving_options_log(options))
        if 'fileBuffer' in options:
            data = base64.b64decode(options['fileBuffer'][options['fileBuffer'].find(PlateSolving.DATAURL_SEPARATOR) + len(PlateSolving.DATAURL_SEPARATOR):])
            fits_file_path = self.__data_to_fits(data, temp_path)
        elif 'filePath' in options and os.path.isfile(options['filePath']):
            fits_file_path = options['filePath']
        elif 'cameraOptions' in options:
            from system import controller
            cameraOptions = options['cameraOptions']
            camera = controller.indi_server.get_camera(cameraOptions['camera']['id'])
            logger.debug('Shooting on camera {} with options {}'.format(camera, cameraOptions))
            result = camera.shoot_image(cameraOptions)
            logger.debug('Shoot successfull: {}'.format(result))
            fits_file_path = result['filename']
        else:
            raise BadRequestError('You must pass either a fileBuffer object (data-uri formatted) or a filePath argument')
        resolution = None
        with fits.open(fits_file_path) as fits_file:
            resolution = fits_file[0].data.shape

        
        if options.get('sync', False):
            return self.__wait_for_solution(options, resolution, fits_file_path, temp_path)
        else:
            self.solver_thread = start_thread(self.__async_wait_for_solution, options, resolution, fits_file_path, temp_path)
            return self.to_map()

    def __async_wait_for_solution(self, *args, **kwargs):
        self.event_listener.on_platesolving_finished(self.__wait_for_solution(*args, **kwargs))

    def __wait_for_solution(self, options, resolution, fits_file_path, temp_path):
        try:
            solved, solution = self.__run_solve_field(options, fits_file_path, temp_path)
            if solved:
                solution_property = { 'values': [] }
                solution_property['values'].append({ 'label': 'Right ascension', 'name': 'ASTROMETRY_RESULTS_RA', 'value': solution['ASTROMETRY_RESULTS_RA'] })
                solution_property['values'].append({ 'label': 'Declination', 'name': 'ASTROMETRY_RESULTS_DE', 'value': solution['ASTROMETRY_RESULTS_DE'] })
                solution_property['values'].append({ 'label': 'Pixel scale', 'name': 'ASTROMETRY_RESULTS_PIXSCALE', 'value': solution['ASTROMETRY_RESULTS_PIXSCALE'] })
                solution_property['values'].append({ 'label': 'Field width', 'name': 'ASTROMETRY_RESULTS_WIDTH', 'value': resolution[1] * solution['ASTROMETRY_RESULTS_PIXSCALE'] / 3600. })
                solution_property['values'].append({ 'label': 'Field height', 'name': 'ASTROMETRY_RESULTS_HEIGHT', 'value': resolution[0] * solution['ASTROMETRY_RESULTS_PIXSCALE'] / 3600. })
                if solution['ASTROMETRY_RESULTS_ORIENTATION'] is not None:
                    solution_property['values'].append({ 'label': 'Field rotation (degrees E of N)', 'name': 'ASTROMETRY_RESULTS_ORIENTATION', 'value': solution['ASTROMETRY_RESULTS_ORIENTATION'] })
                    

                if options.get('syncTelescope'):
                    telescope = [t for t in self.server.telescopes() if t.id == options['telescope']]
                    if not telescope:
                        raise NotFoundError('Unable to find telescope {}'.format(telescope))
                    telescope = telescope[0]
                    telescope_coordinates = { 'ra': solution['ASTROMETRY_RESULTS_RA'] * (24./360.), 'dec': solution['ASTROMETRY_RESULTS_DE'] }
                    telescope.sync(telescope_coordinates)
                return {
                    'status': 'solved',
                    'solution': solution_property,
                }
            else:
                raise FailedMethodError('Plate solving failed, check astrometry driver log')
        except Exception as e:
            logger.warning('Error running platesolver with options {}'.format(self.__platesolving_options_log(options)), exc_info=e)
            self.__set_status('error')
            return {
                'status': 'error',
                'error': str(e),
            }
        finally:
            shutil.rmtree(temp_path, True)
            self.solver_thread = None
            if not options.get('internalSkipIdle', False):
                self.__set_status('idle')


    def __run_solve_field(self, options, fits_file_path, temp_path):
        astrometry_cfg = settings.astrometry_path('astrometry.cfg')
        with open(astrometry_cfg, 'w') as astrometry_cfg_file:
            astrometry_cfg_file.write('cpulimit {}\n'.format(settings.astrometry_cpu_limit))
            astrometry_cfg_file.write('add_path {}\n'.format(settings.astrometry_path()))
            astrometry_cfg_file.write('autoindex\n')

        self.solver_process_cancel_file = '/tmp/{}-{}.cancel'.format(os.path.basename(fits_file_path), int(time.time()))

        cli = self.__build_astrometry_options(options, fits_file_path, astrometry_cfg, temp_path)
        logger.debug('[Astrometry] running solve-field with cli: %s', str(cli))
        self.solver_process = subprocess.Popen(cli, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        logger.debug('[Astrometry] Started solve-field on file {}, pid {}, cancel file: {}'.format(fits_file_path, self.solver_process.pid, self.solver_process_cancel_file))

        rotation_angle = None
        pixscale = None
        with self.solver_process.stdout:
            for b_line in iter(self.solver_process.stdout.readline, b'\n'):
                line = b_line.decode('utf-8').strip()
                if line:
                    logger.debug('[PlateSolving]: %s', line)
                if 'Field rotation angle: up is' in line:
                    re_rotation_angle = re.findall('Field rotation angle: up is ([\d.-]+) degrees', line)
                    logger.debug('[PlateSolving]: rotation angle regex detected: {}'.format(re_rotation_angle))
                    if re_rotation_angle:
                        rotation_angle = float(re_rotation_angle[0])
                if 'pixel scale' in line:
                    re_pixscale = re.findall('pixel scale ([\d.]+) arcsec/pix.', line)
                    logger.debug('[PlateSolving]: pixel scale regex detected: {}'.format(re_pixscale))
                    if re_pixscale:
                        pixscale = float(re_pixscale[0])
                if not options.get('suppressMessages', False):
                    self.event_listener.on_platesolving_message(line)

        logger.debug('PlateSolving::__run_solve_field: Waiting for solver process to finish')
        try:
            self.solver_process.communicate() # check error status
        except ValueError:
            pass
        logger.debug('PlateSolving::__run_solve_field: Solver finished, exit code: {}'.format(self.solver_process.returncode))
        self.solver_process = None
        if os.path.isfile(self.solver_process_cancel_file):
            os.remove(self.solver_process_cancel_file)
        self.solver_process_cancel_file = None

        solved_file = os.path.join(temp_path, 'solve-field.solved')
        solved = os.path.exists(solved_file)
        if not solved:
            logger.debug('PlateSolving::__run_solve_field: solved file {} not found'.format(solved_file))
        solution = dict()
        if solved:
            with fits.open(os.path.join(temp_path, 'solve-field.new')) as fits_file:
                solution['ASTROMETRY_RESULTS_RA'] = fits_file[0].header['CRVAL1']
                solution['ASTROMETRY_RESULTS_DE'] = fits_file[0].header['CRVAL2']
                solution['ASTROMETRY_RESULTS_PIXSCALE'] = fits_file[0].header['SCALE'] if 'SCALE' in fits_file[0].header else pixscale
                solution['ASTROMETRY_RESULTS_ORIENTATION'] = rotation_angle

        return solved, solution

    def __build_astrometry_options(self, options, input_file, config_file, temp_path):
        cli_options = ['solve-field', '-C', self.solver_process_cancel_file, '-D', temp_path, '-o', 'solve-field', '--no-verify', '--resort', '--crpix-center', '-O', '--config', '{}'.format(config_file)]
        if 'plot' not in options:
            cli_options.append('--no-plots')
        if 'fov' in options:
            fov = options['fov']
            if 'minimumWidth' in fov and 'maximumWidth' in fov and fov['minimumWidth'] < fov['maximumWidth']:
                cli_options.extend(['-L', fov['minimumWidth'], '-H', fov['maximumWidth'], '-u', 'arcminwidth'])
        if 'downsample' in options:
            cli_options.extend(['--downsample', options['downsample']])
        if 'target' in options and 'searchRadius' in options and options['searchRadius']:
            cli_options.extend(['-3', options['target']['raj2000'], '-4', options['target']['dej2000'], '-5', options['searchRadius']])
        if 'timeout' in options:
            cli_options.extend(['-l', options['timeout']])
        cli_options.append(input_file)
        logger.debug(cli_options)
        return [str(x) for x in cli_options]

    def __set_status(self, status):
        self.status = status
        self.event_listener.on_platesolving_status(self.to_map())
