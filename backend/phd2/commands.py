from .errors import PHD2MethodError
from app import logger


class StopService:
    def __call__(self, process):
        process.stop()


class GetState:
    def __call__(self, process):
        process.reply(process.state) 


class GetPHD2State:
    def __call__(self, process):
        state_reply = process.phd2_method('get_app_state')
        process.state['phd2_state'] = state_reply['result']


# class GetEquipmentConnected:
#     def __call__(self, process):
#         reply = process.phd2_method('get_connected')
#         process.state['equipmentConnected'] = reply['result']
# 
# class AutoselectStar:
#     def __call__(self, process):
#         reply = process.phd2_method('find_star')
#         process.state['selectedStar'] = reply['result']
#         process.state['phd2_state'] = 'Selected'

class Dither:
    def __init__(self, pixels, ra_only, settle_object, wait_for_settle):
        self.pixels = pixels
        self.ra_only = ra_only
        self.settle_object = settle_object
        self.wait_for_settle = wait_for_settle

    def __call__(self, process):
        try:
            process.state.pop('settling', None)
            process.state.pop('settling_error', None)
            process.state.pop('settling_error_message', None)
            process.state.pop('settling_error_code', None)
            process.phd2_method('dither', self.pixels, self.ra_only, self.settle_object)
            if self.wait_for_settle:
                while not 'settling' in process.state:
                    pass # should be handled better. We need some time for phd2 to actually start settling
                while process.state['settling']:
                    pass
                if process.state['settling_error']:
                    raise PHD2MethodError('dither', 'Dithering settling failed: {}'.format(process.state['settling_error_message']), process.state['settling_error_code'])
            process.reply({
                'success': True,
            })
        except PHD2MethodError as e:
            process.reply({
                'error': True,
                'error_message': e.get_message(),
            })

