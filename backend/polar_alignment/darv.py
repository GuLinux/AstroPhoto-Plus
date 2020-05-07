import time
from errors import BadRequestError
from system import controller
from utils.threads import start_thread

class DARV:
    def shoot(self, guider_id, exposure, initial_pause):
        if exposure < 30:
            raise BadRequestError('Exposure should be at least 30 seconds')
        guider = [g for g in controller.indi_server.guiders() if g.id == guider_id]
        if not guider:
            raise BadRequestError('Guider not found: {} (guiders: {})'.format(guider_id, ', '.join([g.id for g in controller.indi_server.guiders()])))
        start_thread(self.__darv, guider[0], exposure, initial_pause)
        return { 'started': 'ok' }

    def __darv(self, guider, exposure, initial_pause):
        step_exposure = (exposure - initial_pause) / 2.0
        time.sleep(initial_pause)
        guider.guide('west', step_exposure)
        time.sleep(step_exposure)
        guider.guide('east', step_exposure)
        time.sleep(step_exposure)




darv = DARV()

