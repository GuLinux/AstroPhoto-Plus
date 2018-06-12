from .device import Device
from .exceptions import NotFoundError

class Camera:
    def __init__(self, client, logger, device=None, camera=None):
        self.client = client
        self.logger = logger
        if device:
            self.device = device
            self.camera = [c for c in self.client.cameras() if c.name == device.name]
            if not self.camera:
                raise NotFoundError('Camera {} not found'.format(device.name))
            self.camera = self.camera[0]

        elif camera:
            self.camera = camera
            self.device = Device(client, logger, name=camera.name)

    @property
    def id(self):
        return self.device.id

    def to_map(self):
        return {
            'id': self.id,
            'device': self.device.to_map(),
            'connected': self.camera.connected,
        }


    def indi_sequence_camera(self):
        return self.camera

    def shoot_image(self, options):
        exposure = options['exposure']
        self.camera.set_upload_to('client')
        self.camera.shoot(exposure)
