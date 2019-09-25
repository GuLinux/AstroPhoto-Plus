class StopService:
    def __call__(self, process=None):
        process.stop()


class GetState:
    def __call__(self, process=None):
        process.reply(process.state) 

class GetPHD2State:
    def __call__(self, process=None):
        state_reply = process.phd2_method('get_app_state')
        process.state['phd2_state'] = state_reply['result']

