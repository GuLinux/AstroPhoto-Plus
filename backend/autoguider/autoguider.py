from .donuts_autoguider import DonutsAutoguider
from .phd2_autoguider import PHD2Autoguider
from errors import FailedMethodError, BadRequestError
from system import settings


class Autoguider:
    def __init__(self, event_listener, indi_server):
        self.phd2 = PHD2Autoguider(event_listener)
        self.donuts = DonutsAutoguider(event_listener, indi_server)

    def set_engine(self, engine):
        if engine not in ['phd2', 'donuts']:
            raise BadRequestError('Engine {} not supported'.format(engine))
        settings.update({ 'autoguider_engine': engine })

    def status(self):
        status = self.__engine().status()
        status.update({
            'engine': self.engine,
        })
        return status

    def guide(self, recalibrate):
        return self.__engine().guide(recalibrate)

    def dither(self, pixels):
        return self.__engine().dither(pixels)

    def stop(self):
        return self.__engine().stop()

    @property
    def engine(self):
        return settings.autoguider_engine

    def __engine(self):
        if self.engine == 'phd2':
            return self.phd2
        if self.engine == 'donuts':
            return self.donuts
        raise FailedMethodError('Engine not found: ' + self.engine)
