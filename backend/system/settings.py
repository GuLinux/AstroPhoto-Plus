import os
from errors import BadRequestError
import six
from redis_client import redis_client
from app import logger
import logging
import sys
def syslog(s):
    sys.stderr.write('{}\n'.format(s))
    sys.stderr.flush()


log_levels = {
    'CRITICAL': logging.CRITICAL,
    'ERROR': logging.ERROR,
    'WARNING': logging.WARN,
    'INFO': logging.INFO,
    'DEBUG': logging.DEBUG,
}

def lookup_level(level):
    level = [k for k, v in log_levels.items() if v == level]
    if not level:
        return 'WARNING'
    return level[0]

class Settings:
    def __init__(self):
        self.default_datadir = os.environ.get('ASTROPHOTOPLUS_DATADIR', os.path.join(os.environ['HOME'], 'AstroPhoto Plus'))
        self.config_dir = os.path.join(os.environ['HOME'], '.config', 'AstroPhotoPlus')
        self.system_config_dir = os.environ.get('SYSTEM_CONFDIR', '/etc')
        self.indi_service_logs = self.__build_path(['.cache', 'AstroPhotoPlus', 'logs', 'indi_service'], isdir=True)

        self.ro_props = ['default_datadir', 'indi_service_logs', 'config_dir']
        self.rw_props = [
            'sequences_dir',
            'indi_prefix',
            'indi_host',
            'indi_port',
            'indi_service',
            'log_level',
            'sequence_async',
            'indi_server_autoconnect',
            'indi_drivers_autostart',
            'astrometry_cpu_limit',
        ]

        self.on_update = None
        self.reload()

    def reload(self):
        self.json_map = {}
        try:
            self.json_map = redis_client.dict_get('settings')
        except FileNotFoundError:
            pass

    def to_map(self):
        props = []
        props.extend(self.ro_props)
        props.extend(self.rw_props)
        map_object = {}
        for prop in props:
            map_object[prop] = getattr(self, prop)
            if type(map_object[prop]) == bool:
                map_object[prop] = int(map_object[prop])
        return map_object

    @property
    def indi_server_autoconnect(self):
        return self.__get_bool('indi_server_autoconnect', True)

    @property
    def indi_drivers_autostart(self):
        return self.__get_bool('indi_drivers_autostart', True)
 
    @property
    def camera_tempdir(self):
        return self.__build_path(['.cache', 'AstroPhotoPlus', 'camera'], isdir=True)

    @property
    def sequences_dir(self):
        return self.json_map.get('sequences_dir', os.path.join(self.default_datadir, 'Sequences'))

    @property
    def indi_prefix(self):
        return self.json_map.get('indi_prefix', '/usr')

    @property
    def indi_host(self):
        if self.indi_service:
            return 'localhost'
        return self.json_map.get('indi_host', 'localhost')

    @property
    def indi_port(self):
        if self.indi_service:
            return 7624
        return int(self.json_map.get('indi_port', 7624))

    @property
    def indi_service(self):
        return self.__get_bool('indi_service', True)

    @property
    def sequence_async(self):
        return self.__get_bool('sequence_async', True)

    @property
    def log_level(self):
        return lookup_level(logger.getEffectiveLevel())

    @property
    def astrometry_cpu_limit(self):
        return int(self.json_map.get('astrometry_cpu_limit', 600))

    def astrometry_path(self, filename=None):
        if filename:
            return os.path.join(self.astrometry_path(), filename)
        return os.path.join(self.default_datadir, 'Astrometry.Net Data')

    def update(self, new_data):
        ro_props = [x for x in new_data.keys() if x in self.ro_props]
        unsupported_props = [x for x in new_data.keys() if x not in self.rw_props]
        if ro_props:
            raise BadRequestError('The following settings are read only and cannot be updated: {}'.format(', '.join(ro_props)))
        if unsupported_props:
            raise BadRequestError('The following settings are invalid: {}'.format(', '.join(unsupported_props)))

        on_update_args = [(x, getattr(self, x), new_data[x]) for x in new_data.keys()]
        
        self.json_map.update(new_data)
        if 'log_level' in new_data:
            self.update_log_level()

        redis_client.dict_set('settings', self.to_map())

        if self.on_update:
            for new_item in on_update_args:
                self.on_update(*new_item)

    def update_log_level(self):
            settings_level = self.json_map.get('log_level', self.log_level)
            syslog('setting log level from {} to {}'.format(self.log_level, settings_level))
            logger.setLevel(log_levels[settings_level])


    def __get_bool(self, name, default_value=False):
        return str(self.json_map.get(name, 'true' if default_value else 'false')).lower() in ['true', '1']

    def __build_path(self, components, root=None, isdir=False):
        path = os.path.join(root if root else os.environ['HOME'], *components)
        os.makedirs(path if isdir else os.path.dirname(path), exist_ok=True)
        return path

settings = Settings()

