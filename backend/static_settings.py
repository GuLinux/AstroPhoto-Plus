import os
import sys

def syslog(s):
    sys.stderr.write('{}\n'.format(s))
    sys.stderr.flush()



class StaticSettings:
    CONFIG_DIR = os.path.join(os.environ['HOME'], '.config', 'AstroPhotoPlus')
    SYSTEM_CONFIG_DIR = os.environ.get('SYSTEM_CONFDIR', '/etc')

    @staticmethod
    def build_path(components, root=None, isdir=False):
        path = os.path.join(root if root else os.environ['HOME'], *components)
        os.makedirs(path if isdir else os.path.dirname(path), exist_ok=True)
        return path

StaticSettings.REDIS_DB_FILENAME = 'redis.rdb'
StaticSettings.REDIS_SERVICE_LOGS = StaticSettings.build_path(['.cache', 'AstroPhotoPlus', 'logs', 'redis_service'], isdir=True)
StaticSettings.INDI_SERVICE_LOGS = StaticSettings.build_path(['.cache', 'AstroPhotoPlus', 'logs', 'indi_service'], isdir=True)
StaticSettings.ASTROMETRY_TEMP_PATH = StaticSettings.build_path(['.cache', 'AstroPhotoPlus', 'astrometry_cache'], isdir=True)


