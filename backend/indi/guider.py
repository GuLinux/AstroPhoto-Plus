from .device import Device
from app import logger
from errors import NotFoundError, FailedMethodError, BadRequestError

class Guider:
    def __init__(self, settings, client, device=None, name=None):
        self.settings = settings
        self.client = client
        if device:
            self.device = Device(client, logger, device)
        elif name:
            device = [c for c in self.client.devices() if c.name == name]
            self.device = device if device else None
        if not self.device:
           raise NotFoundError('Guider device not found: {}'.format(name)) 

    @property
    def id(self):
        return self.device.id

    def to_map(self):
        return {
            'id': self.id,
            'device': self.device.to_map(),
            'connected': self.device.connected(),
            'status': self.guider_status(),
        }

    def guider_status(self):
        return {
            'TELESCOPE_TIMED_GUIDE_NS': self.device.get_property('TELESCOPE_TIMED_GUIDE_NS').to_map(),
            'TELESCOPE_TIMED_GUIDE_WE': self.device.get_property('TELESCOPE_TIMED_GUIDE_WE').to_map(),
        }

    def guide(self, direction, duration):
        property_values = {
            'north': ('NS', 'N'),
            'south': ('NS', 'S'),
            'west': ('WE', 'W'),
            'east': ('WE', 'E'),
        }
        try:
            guide_axis, guide_direction = property_values[direction]
        except KeyError:
            raise BadRequestError('Bad guide direction: {}'.format(direction))
        guide_property = self.device.get_property('TELESCOPE_TIMED_GUIDE_{}'.format(guide_axis))
        guide_property.set_values({'TIMED_GUIDE_{}'.format(guide_direction): int(1000*duration)})
        return self.guider_status()

