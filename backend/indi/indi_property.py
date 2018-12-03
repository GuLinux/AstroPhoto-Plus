from models import id_by_properties, with_attrs
from . import device
from errors import NotFoundError
import functools
from app import logger


def with_indi_property(f):
    @functools.wraps(f)
    def f_wrapper(self, *args, **kwargs):
        self.find_indi_property()
        return f(self, *args, **kwargs)
    return f_wrapper


def with_type(f):
    @functools.wraps(f)
    def f_wrapper(self, *args, **kwargs):
        self.find_type()
        return f(self, *args, **kwargs)
    return f_wrapper


def with_label(f):
    @functools.wraps(f)
    def f_wrapper(self, *args, **kwargs):
        self.find_label()
        return f(self, *args, **kwargs)
    return f_wrapper


class Property:
    def __init__(self, client, logger, indi_property=None, indi_device_property=None, indi_vector_property=None, device=None, group=None, name=None, label=None, property_type=None):
        self.client = client
        self.logger = logger
        self.name = None
        self.group = None
        self.device = None
        self.indi_property = None
        self.label = None
        self.type = type

        if indi_vector_property:
            self.__init_by_vector_property(indi_vector_property)
        elif indi_property:
            self.__init_by_indi_property(indi_property)
        elif indi_device_property:
            self.__init_by_indi_device_property(indi_device_property)
        elif name and device:
            self.__init_by_values(device, group, name, label, property_type)
        else:
            raise RuntimeError('Property initialization error')
        self.id = id_by_properties([self.device, self.name])

    @with_indi_property
    def to_map(self):
        base_property = { 'id': self.id }
        base_property.update(self.indi_property)
        base_property['device'] = device.Device(self.client, self.logger, name=self.device).id
        return base_property

    def find_indi_property(self):
        if not self.indi_property:
            indi_device = device.Device(self.client, self.logger, name=self.device).find_indi_device()
            self.indi_property = indi_device.get_property(self.name)
        if not self.indi_property:
            raise NotFoundError('Unable to find INDI property {} on device {}'.format(self.name, self.device))
        return self.indi_property

    @with_indi_property
    def find_type(self):
        if not self.type:
            self.type = self.indi_property['type']
        return self.type

    @with_indi_property
    def find_label(self):
        if not self.label:
            self.label = self.indi_property['label']
        return self.label


    @with_type
    def set_values(self, property_values, sync=False, timeout=None):
        indi_device = device.Device(self.client, self.logger, name=self.device).find_indi_device()
        try:
            self.logger.info('setting property value for {}'.format(self.name))
            if self.type == 'switch':
                on_switches = []
                off_switches = []
                for key, value in property_values.items():
                    if value:
                        on_switches.append(key)
                    else:
                        off_switches.append(key)
                self.logger.debug('on_switches: {}'.format(on_switches))
                self.logger.debug('off_switches: {}'.format(off_switches))

                indi_device.set_switch(self.name, on_switches, off_switches, sync=sync, timeout=timeout)
            elif self.type == 'number':
                indi_device.set_number(self.name, property_values, sync=sync, timeout=timeout)
            elif self.type == 'text':
                indi_device.set_text(self.name, property_values, sync=sync, timeout=timeout)
            else:
                raise RuntimeError('Property type unsupported: {}'.format(self.type))
            return True
        except:
            self.logger.exception('Error setting property {} with values {}'.format(self.name, property_values))
            return False


    def __init_by_indi_device_property(self, indi_property):
        self.name = indi_property.getName()
        self.group = indi_property.getGroupName()
        self.device = indi_property.getDeviceName()
        self.label = indi_property.getLabel()

    def __init_by_indi_property(self, indi_property):
        self.name = indi_property['name']
        self.group = indi_property['group']
        self.device = indi_property['device']
        self.label = indi_property['label']
        self.type = indi_property['type']

    def __init_by_vector_property(self, indi_vector_property):
        self.name = indi_vector_property.name
        self.group = indi_vector_property.group
        self.device = indi_vector_property.device
        self.label = indi_vector_property.label

    def __init_by_values(self, device, group, name, label, property_type):
        self.device = device
        self.group = group
        self.name = name
        self.label = label
        self.type = property_type


