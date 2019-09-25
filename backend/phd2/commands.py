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


class GetEquipmentConnected:
    def __call__(self, process):
        reply = process.phd2_method('get_connected')
        process.state['equipmentConnected'] = reply['result']

class AutoselectStar:
    def __call__(self, process):
        reply = process.phd2_method('find_star')
        process.state['selectedStar'] = reply['result']
        process.state['phd2_state'] = 'Selected'
