from app import logger
from system import settings
from .phd2_service import PHD2Service

class PHD2:
    def __init__(self):
        settings.add_update_listener(self.__on_settings_update)
        self.service = PHD2Service()

    def status(self):
        return { 'connected': False }

    def __on_settings_update(self, setting, old_value, new_value):
        if setting == 'autoguider_engine':
            logger.debug('PHD2: engine changed from %s to %s', old_value, new_value)
            if new_value == 'phd2':
                self.service.start()
            else:
                self.service.stop()


phd2 = PHD2()

