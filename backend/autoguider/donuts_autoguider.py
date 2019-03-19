class DonutsAutoguider:
    def __init__(self, events_listener, indi_server):
        self.events_listener = events_listener
        self.indi_server = indi_server
        self.guiding = False
        self.guide_camera = None
        self.guide_device = None
        self.exposure = None
        self.guide_on_dec = False

    def status(self):
        return {}

    def set_camera(self, camera_name):
        self.camera = camera_name

    def set_guide_device(self, guide_device_name):
        self.guide_device = guide_device_name

    def set_guide_exposure(self, seconds):
        self.exposure = seconds

    def set_guide_on_dec(self, guide_on_dec):
        self.guide_on_dec = guide_on_dec

    def guide(self, recalibrate=True):
        pass

    def dither(self, pixels):
        pass
    
    def stop(self):
        pass

