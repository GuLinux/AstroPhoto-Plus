from static_settings import StaticSettings, syslog
from service import Service
import sys

class RedisServer:
    def __init__(self):
        self.port = Service.find_free_port()
        self.service = Service('redis', StaticSettings.REDIS_SERVICE_LOGS)

    def start(self):
        syslog('**** Initialising Redis server on port {}'.format(self.port))
        if self.service.is_running():
            raise RuntimeError('Service is already running')
        arguments = [
            '--port', str(self.port),
            '--dbfilename', StaticSettings.REDIS_DB_FILENAME,
            '--dir', StaticSettings.CONFIG_DIR,
            '--appendfsync', 'everysec',
            '--daemonize', 'no',
            '--always-show-logo', 'no',
            '--save', '60', '1',
            '--save', '30', '10',
            '--save', '15', '1000',
        ]
        self.service.start('redis-server', arguments)

    def stop(self, *args, **kwargs):
        self.service.stop(*args, **kwargs)

