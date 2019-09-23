from app import logger
from system import settings, syslog
from .phd2_service import PHD2Service
from utils.mp import mp_start_process, mp_queue
from utils.threads import start_thread
import commands
from errors import FailedMethodError
from system import sse
import queue

class PHD2:
    def __init__(self):
        settings.add_update_listener(self.__on_settings_update)
        self.input_queue, self.output_queue, self.events_queue = mp_queue(), mp_queue(), mp_queue()
        self.__service = None
        self.__events_thread, self.__events_thread_running = None, False
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
        self.__service = mp_start_process(self.__run_service, self.output_queue, self.input_queue, self.events_queue)
        self.__events_thread = start_thread(self.__process_events)

    def __stop(self):
        if self.__service:
            self.output_queue.put(commands.StopService())
            self.__service.join()
            self.__service = None
            self.__events_thread_running = False
            self.__events_thread.join()

    def __run_service(self, *args, **kwargs):
        phd2_service = PHD2Service(*args, **kwargs)
        phd2_service.run()

    def __process_events(self):
        self.__events_thread_running = True
        logger.debug('PHD2: listening for events')
        while self.__events_thread_running:
            try:
                event = self.events_queue.get()
                sse.publish_event('phd2', event['name'], event['payload'])
            except queue.Empty:
                pass
        logger.debug('PHD2: stopping listening for events')


phd2 = PHD2()

