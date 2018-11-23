from .device import Device
from app import logger
from errors import NotFoundError, FailedMethodError
import base64
import time
import os

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
        logger.debug(options.keys())
        data = None
        # TODO also read from filesystem
        if 'fileBuffer' in options:
            data = base64.b64decode(options['fileBuffer'][options['fileBuffer'].find(Astrometry.DATAURL_SEPARATOR) + len(Astrometry.DATAURL_SEPARATOR):])
        elif 'filePath' in options and os.path.isfile(options['filePath']):
            with open(options['filePath'], 'rb') as f:
                data = f.read()
        else:
            raise BadRequestError('You must pass either a fileBuffer object (data-uri formatted) or a filePath argument')

        self.__set_enabled(True)
        try:
            self.__set_astrometry_options(options)
            self.__upload_blob(data)
            logger.debug('Waiting for solver to finish')
            started = time.time()
            while self.__solver_status() != 'BUSY' and time.time() - started < 5:
                time.sleep(1)
            while self.__solver_status() == 'BUSY':
                time.sleep(1)

            final_status = self.__solver_status()
            if final_status == 'OK':
                solution_property = self.device.get_property('ASTROMETRY_RESULTS').to_map()
                if options['syncTelescope']:
                    solution_values = dict([ (v['name'], v['value']) for v in solution_property['values'] ])
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
        settings_property = self.device.get_property('ASTROMETRY_SETTINGS')
        settings_property.set_values({'ASTROMETRY_SETTINGS_OPTIONS': self.__build_astrometry_options(options)})


    def __build_astrometry_options(self, options):
        cli_options = '--no-verify --no-plots --resort --downsample 2 -O'
        if 'fov' in options:
            fov = options['fov']
            if 'minimumWidth' in fov and 'maximumWidth' in fov and fov['minimumWidth'] < fov['maximumWidth']:
                cli_options += ' -L {} -H {} -u arcminwidth'.format(fov['minimumWidth'], fov['maximumWidth'])
        return cli_options
