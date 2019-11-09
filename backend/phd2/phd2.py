from app import logger
from system import settings, syslog
from .phd2_service import PHD2Service
from .errors import PHD2MethodError, PHD2ConnectionError
from utils.mp import mp_start_process, mp_queue
from utils.threads import start_thread, thread_queue
from errors import FailedMethodError, BadRequestError
import queue

class PHD2:
    def __init__(self):
        settings.add_update_listener(self.__on_settings_update)
        self.__service = PHD2Service()

        if settings.autoguider_engine == 'phd2':
            self.__service.start()

    def status(self):
        if self.__service.is_running():
            return self.__execute('get_state')
        return { 'running': False }

    def start_phd2(self, binary_path, display):
        return self.__execute('start_phd2', binary_path, display)

    def stop_phd2(self):
        return self.__execute('stop_phd2') 

    def set_profile(self, profile_id):
        self.__execute('set_profile', profile_id)
        return { 'result': 'ok' }

    def is_guiding(self):
        status = self.status()
        return status['running'] and status['connected'] and status['phd2_state'] == 'Guiding'

    def start_framing(self):
        self.__execute('start_framing')
        return { 'result': 'ok' }

    def start_guiding(self, settle, recalibrate):
        if not settle:
            settle = {
                'pixels': settings.autoguider_settle_pixels,
                'time': settings.autoguider_settle_time,
                'timeout': settings.autoguider_settle_timeout,
            }

        self.__execute('start_guiding', settle, recalibrate)
        return { 'result': 'ok' }

    def stop_capture(self):
        self.__execute('stop_capture')
        return { 'result': 'ok' }

    def dither(self, pixels, settle_pixels, settle_time, settle_timeout, ra_only=False, wait_for_settle=False):
        settle_object = {
            'pixels': settle_pixels,
            'time': settle_time,
            'timeout': settle_timeout,
        }
        try:
            result = self.__execute('dither', pixels, ra_only, settle_object, wait_for_settle=True)
            return result
        except PHD2MethodError as e:
            raise FailedMethodError(e.get_message())

    def __execute(self, *args, **kwargs):
        try:
            return self.__service.execute(*args, **kwargs)
        except PHD2ConnectionError as e:
            raise BadRequestError(e.message)
        except PHD2MethodError as e:
            raise FailedMethodError(str(e))

    def __on_settings_update(self, setting, old_value, new_value):
        if setting == 'autoguider_engine':
            logger.debug('PHD2: engine changed from %s to %s', old_value, new_value)
            if new_value == 'phd2':
                self.__service.start()
            else:
                if self.__service.is_running():
                    self.__service.stop()

phd2 = PHD2()

