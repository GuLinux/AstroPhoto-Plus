from app import logger
from phd2 import phd2
from system import settings

class Autoguider:
    def dither(self):
        if settings.autoguider_engine == 'phd2' and settings.dithering_enabled:
            self.dither_phd2()

    def dither_phd2(self):
        if phd2.is_guiding():
            phd2.dither(settings.dithering_pixels, settings.dithering_settle_pixels, settings.dithering_settle_time, settings.dithering_settle_timeout, ra_only=settings.dithering_ra_only)



autoguider = Autoguider()

