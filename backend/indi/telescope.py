from .device import Device
from app import logger
from errors import NotFoundError, FailedMethodError

class Telescope:
    def __init__(self, settings, client, device=None, name=None):
        self.settings = settings
        self.client = client
        if device:
            self.device = Device(client, logger, device)
        elif name:
            device = [c for c in self.client.devices() if c.name == name]
            self.device = device if device else None
        if not self.device:
           raise NotFoundError('Telescope device not found: {}'.format(name)) 

    @property
    def id(self):
        return self.device.id

    def to_map(self):
        return {
            'id': self.id,
            'device': self.device.to_map(),
            'connected': self.device.connected(),
            'info': self.telescope_info(),
        }


    def telescope_info(self):
        indi_device = self.device.find_indi_device()
        if indi_device:
            return indi_device.values('TELESCOPE_INFO', 'number')
        return {}
    
    def sync(self, coordinates):
        sync_property = self.device.get_property('ON_COORD_SET')
        sync_property.set_values({'SYNC': True})
        self.device.get_property('EQUATORIAL_EOD_COORD').set_values({
            'RA': coordinates['ra'],
            'DEC': coordinates['dec'],
        })

