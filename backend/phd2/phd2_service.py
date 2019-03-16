from system import Service, settings
import time
import os
import subprocess
from app import logger

class PHD2Service:
    def __init__(self, event_listener):
        self.service = Service('phd2', settings.phd2_service_logs)
        self.__vnc_server_binary = 'tigervncserver'
        self.display_number = ':10'
        self.module_path = os.path.dirname(os.path.realpath(__file__))
        self.event_listener = event_listener

    def status(self):
        return {
            'is_running': self.service.is_running(),
            'display': self.display_number,
        }

    def start(self, options):
        try:
            self.service.start(self.__vnc_server_binary, self.__build_server_options(options), on_started=self.__on_started, on_exit=self.__on_exit)
            return self.status()
        except RuntimeError as e:
            raise BadRequestError(str(e))
 

    def stop(self):
        self.reset()

    def reset(self):
       subprocess.run([self.__vnc_server_binary, '-kill', self.display_number])

    def __build_server_options(self, options):
        return [
            '-SecurityTypes', 'None',
            '--I-KNOW-THIS-IS-INSECURE',
            '-geometry', '{}x{}'.format(options.get('width', 1024), options.get('height', 768)),
            '-localhost', 'no',
            '-cleanstale',
            '-fg',
            '-xstartup', self.__path('xstartup'),
            self.display_number,
        ]

    def __path(self, entry):
        return os.path.join(self.module_path, entry)

    def __on_started(self, service):
        time.sleep(1.5)
        if not self.service.is_running():
            return
        payload = self.__service_logs()
        logger.debug('PHD service started: {}'.format(payload))
        self.event_listener.on_phd2_started({ 'stdout': self.__service_logs() })

    def __on_exit(self, service):
        payload = { 'exit_code': self.service.exit_code() }
        payload.update(self.__service_logs())
        logger.debug('PHD service exited: {}'.format(payload))
        self.event_listener.on_phd2_exited(payload)

    def __service_logs(self):
        return {
            'stdout': self.service.get_stdout(),
            'stderr': self.service.get_stderr(),
        }
