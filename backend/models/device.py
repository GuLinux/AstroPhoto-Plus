from .model import id_by_properties
from .exceptions import NotFoundError
import functools
from . import indi_property

def with_indi_device(f):
    @functools.wraps(f)
    def f_wrapper(self, *args, **kwargs):
        self.find_indi_device()
        return f(self, *args, **kwargs)
    return f_wrapper


class Device:
    def __init__(self, client, logger, indi_device=None, name=None):
        self.client = client
        self.logger = logger
        self.name = None
        self.indi_device = None
        if indi_device:
            self.__init_by_device(indi_device)
        elif name:
            self.__init_by_value(name)
        else:
            raise RuntimeError('Device initialized without INDI device nor name')
        self.id = id_by_properties(self.name)
    
    def __init_by_device(self, indi_device):
        self.indi_device = indi_device
        self.name = indi_device.name

    def __init_by_value(self, name):
        self.name = name

    @with_indi_device
    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'interfaces': self.indi_device.interfaces,
        }

    def find_indi_device(self):
        if not self.indi_device:
            devices = [d  for d in self.client.devices() if d.name == self.name]
            if not devices:
                raise NotFoundError('device {} not found.'.format(self.name))
            self.indi_device = devices[0]
        return self.indi_device

    @with_indi_device
    def properties(self):
        return [indi_property.Property(self.client, self.logger, indi_property=p) for p in self.indi_device.get_properties()]

    def get_property(self, property_name):
        self.logger.debug('Properties: {}'.format(', '.join([x.name for x in self.properties])))
        properties = [x for x in self.properties if x.name == property_name]
        return properties[0] if properties else None


    @with_indi_device
    def get_queued_message(self, message):
        return self.indi_device.get_queued_message(message)

    def __str__(self):
        return 'Device: {}'.format(self.name)

    def __repr__(self):
        return self.__str__()


