from .device import Device

class Camera(Device):
    def __init__(self, indi_camera):
        Device.__init__(self, indi_camera)

