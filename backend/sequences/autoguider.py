from app import logger
from phd2 import phd2
from system import settings

class Autoguider:
    def dither(self):
        if settings.autoguider_engine == 'phd2':
            self.dither_phd2()

    def dither_phd2(self):
        if phd2.is_guiding():
            phd2.dither(5, 1, 5, 60)



autoguider = Autoguider()

