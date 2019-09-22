class StopService:
    def __call__(self, process=None, service=None):
        process.stop()
