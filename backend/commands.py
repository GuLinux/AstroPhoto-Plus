class StopService:
    def __call__(self, process=None):
        process.stop()


class GetState:
    def __call__(self, process=None):
        process.reply(process.state()) 
