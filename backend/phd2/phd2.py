from app import logger
from system import settings, syslog
from .phd2_service import PHD2Service
from utils.mp import mp_start_process, mp_queue
import commands
from errors import FailedMethodError

class PHD2:
    def __init__(self):
        settings.add_update_listener(self.__on_settings_update)
        self.input_queue, self.output_queue = mp_queue(), mp_queue()
        self.__service = None
        if settings.autoguider_engine == 'phd2':
            self.__start()

    def status(self):
        if not self.__service:
            return { 'running': False }
        return self.sync_command(commands.GetState())

    def sync_command(self, command):
        self.output_queue.put(command)
        return self.get_reply()

    def get_reply(self, timeout=10):
        try: 
            return self.input_queue.get(True, timeout)
        except Exception as e:
            raise FailedMethodError('Error retrieving PHD2 status', str(e))

    def __on_settings_update(self, setting, old_value, new_value):
        if setting == 'autoguider_engine':
            logger.debug('PHD2: engine changed from %s to %s', old_value, new_value)
            if new_value == 'phd2':
                self.__start()
            else:
                self.__stop()

    def __start(self):
        self.__service = mp_start_process(self.__run_service, self.output_queue, self.input_queue)

    def __stop(self):
        if self.__service:
            self.output_queue.put(commands.StopService())
            self.__service = None

    def __run_service(self, *args, **kwargs):
        phd2_service = PHD2Service(*args, **kwargs)
        phd2_service.run()

phd2 = PHD2()

