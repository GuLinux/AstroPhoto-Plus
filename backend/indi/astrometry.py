from .device import Device
from app import logger
from errors import NotFoundError, FailedMethodError
import base64
import time
import os
from astropy.io import fits
from io import BytesIO
from system import settings, controller
import threading


class AstrometryEventListener:
    def __init__(self, device):
        self.device = device
        self.property_state = None

    def on_indi_property_updated(self, property):
        if property.device == self.device.name and property.name == 'ASTROMETRY_SOLVER':
            self.property_state = property.state()

    def wait_for_solver(self, initial_state):
        self.error = None
        self.property_state = initial_state
        logger.debug('PlateSolving::wait_for_solver Initial property state: {}'.format(self.property_state))
        if initial_state == 'BUSY':
            self.error = BadRequestError('Solver already in busy state')
            return
        logger.debug('PlateSolving::wait_for_solver: Waiting for status to become BUSY...')
        while self.property_state != 'BUSY':
            pass
        logger.debug('PlateSolving::wait_for_solver: Waiting for status to be NOT BUSY')
        while self.property_state == 'BUSY':
            pass

class Astrometry:

    DATAURL_SEPARATOR=';base64,'

    def __init__(self, server, device=None, name=None):
        self.server = server
        self.client = server.client

        if device:
            self.device = Device(self.client, logger, device)
        elif name:
            device = [c for c in self.client.devices() if c.name == name]
            self.device = device if device else None
        if not self.device:
           raise NotFoundError('Astrometry device not found: {}'.format(name)) 

        self.event_listener = AstrometryEventListener(self.device)

    @property
    def id(self):
        return self.device.id

    def to_map(self):
        return {
            'id': self.id,
            'device': self.device.to_map(),
            'connected': self.device.connected(),
        }

    def solve_field(self, options):
        data = None
        fits_file = None
        logger.debug('Solve field options: {}'.format(['{}: {}'.format(key, '<blob>' if key == 'fileBuffer' else value)  for key, value in options.items()]))
        if 'fileBuffer' in options:
            data = base64.b64decode(options['fileBuffer'][options['fileBuffer'].find(Astrometry.DATAURL_SEPARATOR) + len(Astrometry.DATAURL_SEPARATOR):])
        elif 'filePath' in options and os.path.isfile(options['filePath']):
            with open(options['filePath'], 'rb') as f:
                data = f.read()
        else:
            raise BadRequestError('You must pass either a fileBuffer object (data-uri formatted) or a filePath argument')
        fits_file = fits.open(BytesIO(data))
        resolution = fits_file[0].data.shape


        self.__set_enabled(True)
        try:
            controller.controller.indi_server.event_listener.add('astrometry', self.event_listener)
            self.__set_astrometry_options(options)
            wait_for_solver_thread = threading.Thread(target=self.event_listener.wait_for_solver, args=(self.__solver_status(), ))
            wait_for_solver_thread.start()
            self.__upload_blob(data)
            logger.debug('Waiting for solver to finish')
            wait_for_solver_thread.join()
            if self.event_listener.error:
                raise self.event_listener.error

            final_status = self.__solver_status()
            if final_status == 'OK':
                solution_property = self.device.get_property('ASTROMETRY_RESULTS').to_map()
                solution_values = dict([ (v['name'], v['value']) for v in solution_property['values'] ])
                solution_property['values'].append({ 'label': 'Field width', 'name': 'ASTROMETRY_RESULTS_WIDTH', 'value': resolution[1] * solution_values['ASTROMETRY_RESULTS_PIXSCALE'] / 3600. })
                solution_property['values'].append({ 'label': 'Field height', 'name': 'ASTROMETRY_RESULTS_HEIGHT', 'value': resolution[0] * solution_values['ASTROMETRY_RESULTS_PIXSCALE'] / 3600. })
                if options['syncTelescope']:

                    logger.debug(solution_values)
                    telescope = [t for t in self.server.telescopes() if t.id == options['telescope']]
                    if not telescope:
                        raise NotFoundError('Unable to find telescope {}'.format(telescope))
                    telescope = telescope[0]
                    telescope_coordinates = { 'ra': solution_values['ASTROMETRY_RESULTS_RA'] * (24./360.), 'dec': solution_values['ASTROMETRY_RESULTS_DE'] }
                    telescope.sync(telescope_coordinates)
                return { 'status': 'OK', 'solution': solution_property }
            else:
                raise FailedMethodError('Plate solving failed, check astrometry driver log')
        finally:
            controller.controller.indi_server.event_listener.remove('astrometry')
            self.__set_enabled(False)

    def __solver_status(self):
        return self.device.get_property('ASTROMETRY_SOLVER').to_map()['state']

    def __set_enabled(self, enabled):
        self.device.get_property('ASTROMETRY_SOLVER').set_values({'ASTROMETRY_SOLVER_ENABLE': enabled, 'ASTROMETRY_SOLVER_DISABLE': not enabled})

    def __upload_blob(self, data):
        self.client.startBlob(self.device.name, 'ASTROMETRY_DATA', str(int(time.time())))
        self.client.sendOneBlobFromBuffer('solve_field.fits', 'image/fits', data)
        self.client.finishBlob()

    def __set_astrometry_options(self, options):
        os.makedirs(settings.astrometry_path(), exist_ok=True)
        astrometry_cfg = settings.astrometry_path('astrometry.cfg')
        with open(astrometry_cfg, 'w') as astrometry_cfg_file:
            astrometry_cfg_file.write('cpulimit {}\n'.format(settings.astrometry_cpu_limit))
            astrometry_cfg_file.write('add_path {}\n'.format(settings.astrometry_path()))
            astrometry_cfg_file.write('autoindex\n')
        settings_property = self.device.get_property('ASTROMETRY_SETTINGS')
        settings_property.set_values({'ASTROMETRY_SETTINGS_OPTIONS': self.__build_astrometry_options(options, astrometry_cfg)})

        self.device.get_property('DEBUG').set_values({'ENABLE': True})

        wait_for_property_retry = 0
        while not self.device.get_property('DEBUG_LEVEL') and wait_for_property_retry < 20:
            time.sleep(0.5)
            wait_for_property_retry += 1

        self.device.get_property('DEBUG_LEVEL').set_values({'DBG_DEBUG': True})


    def __build_astrometry_options(self, options, config_file):
        cli_options = ['--no-verify', '--no-plots', '--resort', '-O', '--config', '"{}"'.format(config_file)]
        if 'fov' in options:
            fov = options['fov']
            if 'minimumWidth' in fov and 'maximumWidth' in fov and fov['minimumWidth'] < fov['maximumWidth']:
                cli_options.extend(['-L', fov['minimumWidth'], '-H', fov['maximumWidth'], '-u', 'arcminwidth'])
        if 'downsample' in options:
            cli_options.extend(['--downsample', options['downsample']])
        logger.debug(cli_options)
        return ' '.join([str(x) for x in cli_options])
