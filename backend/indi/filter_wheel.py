from .device import Device
from errors import NotFoundError

class FilterWheel:
    def __init__(self, client, logger, device=None, filter_wheel=None):
        self.client = client
        self.logger = logger
        if device:
            self.device = device
            self.filter_wheel = [c for c in self.client.filter_wheels() if c.name == device.name]
            if not self.filter_wheel:
                raise NotFoundError('FilterWheel {} not found'.format(device.name))
            self.filter_wheel = self.filter_wheel[0]

        elif filter_wheel:
            self.filter_wheel = filter_wheel
            self.device = Device(client, logger, name=filter_wheel.name)

    @property
    def id(self):
        return self.device.id

    def to_map(self):
        return {
            'id': self.id,
            'device': self.device.to_map(),
            'connected': self.filter_wheel.connected,
        }


    def indi_sequence_filter_wheel(self):
        return self.filter_wheel
