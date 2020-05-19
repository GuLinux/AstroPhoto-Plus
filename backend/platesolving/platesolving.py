from app import logger
from errors import NotFoundError, FailedMethodError, BadRequestError
import base64
import time
import os
from astropy.io import fits
from io import BytesIO
from system import settings, controller
from utils.threads import start_thread
import subprocess
import shutil
import re

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
        if self.solver_process:
            self.solver_process.terminate()
            try:
                self.solver_process.wait(timeout=15)
            except subprocess.TimeoutExpired:
                self.solver_process.kill()
                self.solver_process.wait()
            finally:
                self.solver_process = None
        if self.solver_thread:
            self.solver_thread.join()
        self.solver_thread = None
        return self.to_map()

    def solve_field(self, options):
        if not self.is_available():
            raise BadRequestError('Astrometry.net solve-field not found in {}'.format(settings.astrometry_solve_field_path))

        self.status = 'solving'
        temp_path = os.path.join(settings.astrometry_path(), 'solve_field_{}'.format(time.time()))
        os.makedirs(temp_path, exist_ok=True)
 
        fits_file_path = None
        logger.debug('Solve field options: %s', str(['{}: {}'.format(key, '<blob>' if key == 'fileBuffer' else value)  for key, value in options.items()]))
        if 'fileBuffer' in options:
            fits_file_path = os.path.join(temp_path, 'solve_field_input.fits')
            data = base64.b64decode(options['fileBuffer'][options['fileBuffer'].find(PlateSolving.DATAURL_SEPARATOR) + len(PlateSolving.DATAURL_SEPARATOR):])
            with open(fits_file_path, 'wb') as file:
                file.write(data)

        elif 'filePath' in options and os.path.isfile(options['filePath']):
            fits_file_path = options['filePath']
        else:
            raise BadRequestError('You must pass either a fileBuffer object (data-uri formatted) or a filePath argument')
        resolution = None
        with fits.open(fits_file_path) as fits_file:
            resolution = fits_file[0].data.shape

        
        self.solver_thread = start_thread(self.__wait_for_solution, options, resolution, fits_file_path, temp_path)
        return self.to_map()

    def __wait_for_solution(self, options, resolution, fits_file_path, temp_path):
        try:
            solved, solution = self.__run_solve_field(options, fits_file_path, temp_path)
            logger.debug('Waiting for solver to finish')
            if solved:
                solution_property = { 'values': [] }
                solution_property['values'].append({ 'label': 'Right ascension', 'name': 'ASTROMETRY_RESULTS_RA', 'value': solution['ASTROMETRY_RESULTS_RA'] })
                solution_property['values'].append({ 'label': 'Declination', 'name': 'ASTROMETRY_RESULTS_DE', 'value': solution['ASTROMETRY_RESULTS_DE'] })
                solution_property['values'].append({ 'label': 'Pixel scale', 'name': 'ASTROMETRY_RESULTS_PIXSCALE', 'value': solution['ASTROMETRY_RESULTS_PIXSCALE'] })
                solution_property['values'].append({ 'label': 'Field width', 'name': 'ASTROMETRY_RESULTS_WIDTH', 'value': resolution[1] * solution['ASTROMETRY_RESULTS_PIXSCALE'] / 3600. })
                solution_property['values'].append({ 'label': 'Field height', 'name': 'ASTROMETRY_RESULTS_HEIGHT', 'value': resolution[0] * solution['ASTROMETRY_RESULTS_PIXSCALE'] / 3600. })
                if solution['ASTROMETRY_RESULTS_ORIENTATION'] is not None:
                    solution_property['values'].append({ 'label': 'Field rotation (degrees E of N)', 'name': 'ASTROMETRY_RESULTS_ORIENTATION', 'value': solution['ASTROMETRY_RESULTS_ORIENTATION'] })
                    

                if options['syncTelescope']:
                    telescope = [t for t in self.server.telescopes() if t.id == options['telescope']]
                    if not telescope:
                        raise NotFoundError('Unable to find telescope {}'.format(telescope))
                    telescope = telescope[0]
                    telescope_coordinates = { 'ra': solution['ASTROMETRY_RESULTS_RA'] * (24./360.), 'dec': solution['ASTROMETRY_RESULTS_DE'] }
                    telescope.sync(telescope_coordinates)
                self.event_listener.on_platesolving_finished({
                    'status': 'solved',
                    'solution': solution_property,
                })
            else:
                raise FailedMethodError('Plate solving failed, check astrometry driver log')
        except Exception as e:
            self.event_listener.on_platesolving_finished({
                'status': 'error',
                'error': str(e),
            })
        finally:
            self.status = 'idle'
            shutil.rmtree(temp_path, True)
            self.solver_thread = None


    def __run_solve_field(self, options, fits_file_path, temp_path):
        astrometry_cfg = settings.astrometry_path('astrometry.cfg')
        with open(astrometry_cfg, 'w') as astrometry_cfg_file:
            astrometry_cfg_file.write('cpulimit {}\n'.format(settings.astrometry_cpu_limit))
            astrometry_cfg_file.write('add_path {}\n'.format(settings.astrometry_path()))
            astrometry_cfg_file.write('autoindex\n')
        cli = self.__build_astrometry_options(options, fits_file_path, astrometry_cfg, temp_path)
        logger.debug('[Astrometry] running solve-field with cli: %s', str(cli))
        self.solver_process = subprocess.Popen(cli, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
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
                self.event_listener.on_platesolving_message(line)

        self.solver_process.wait() # check error status
        self.solver_process = None

        solved = os.path.exists(os.path.join(temp_path, 'solve-field.solved'))
        solution = dict()
        if solved:
            with fits.open(os.path.join(temp_path, 'solve-field.new')) as fits_file:
                solution['ASTROMETRY_RESULTS_RA'] = fits_file[0].header['CRVAL1']
                solution['ASTROMETRY_RESULTS_DE'] = fits_file[0].header['CRVAL2']
                solution['ASTROMETRY_RESULTS_PIXSCALE'] = fits_file[0].header['SCALE'] if 'SCALE' in fits_file[0].header else pixscale
                solution['ASTROMETRY_RESULTS_ORIENTATION'] = rotation_angle

        return solved, solution

    def __build_astrometry_options(self, options, input_file, config_file, temp_path):
        cli_options = ['solve-field', '-D', temp_path, '-o', 'solve-field', '--no-verify', '--resort', '--crpix-center', '-O', '--config', '{}'.format(config_file)]
        if 'plot' not in options:
            cli_options.append('--no-plots')
        if 'fov' in options:
            fov = options['fov']
            if 'minimumWidth' in fov and 'maximumWidth' in fov and fov['minimumWidth'] < fov['maximumWidth']:
                cli_options.extend(['-L', fov['minimumWidth'], '-H', fov['maximumWidth'], '-u', 'arcminwidth'])
        if 'downsample' in options:
            cli_options.extend(['--downsample', options['downsample']])
        if 'target' in options and 'searchRadius' in options:
            cli_options.extend(['-3', options['target']['raj2000'], '-4', options['target']['dej2000'], '-5', options['searchRadius']])
        cli_options.append(input_file)
        logger.debug(cli_options)
        return [str(x) for x in cli_options]
