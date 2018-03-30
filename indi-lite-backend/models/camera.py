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

    def to_map(self):
        return {
            'id': self.device.id,
            'device': self.device.to_map()
        }

