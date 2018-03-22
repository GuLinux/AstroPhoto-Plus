from .model import id_by_properties, with_attrs


class Device:
    def __init__(self, logger, indi_device=None, name=None):
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

    def to_map(self):
        return {
            'name': self.name
        }

    @with_attrs(['indi_device'])
    def properties(self):
        return self.indi_device.get_properties()

    @with_attrs(['indi_device'])
    def get_property(self, group, name):
        property = [p for p in self.properties() if p['name'] == name and p['group'] == group]
        if not property:
            raise RuntimeError('Property {}/{} not found in {}'.format(group, name, self.name))
        return property[0]

    @with_attrs(['indi_device'])
    def set_property(self, indi_property, property_values):
        proptype = indi_property['type']
        try:
            if proptype == 'switch':
                on_switches = []
                off_switches = []
                for key, value in property_values.items():
                    if value:
                        on_switches.append(key)
                    else:
                        off_switches.append(key)
                self.logger.debug('setting switch value for {}'.format(self.name))
                self.logger.debug('on_switches: {}'.format(on_switches))
                self.logger.debug('off_switches: {}'.format(off_switches))

                self.indi_device.set_switch(indi_property['name'], on_switches, off_switches, sync=False)
            elif proptype == 'number':
                self.indi_device.set_number(indi_property['name'], property_values, sync=False)
            elif proptype == 'text':
                self.indi_device.set_text(indi_property['name'], property_values, sync=False)
            else:
                raise RuntimeError('Property type unsupported: {}'.format(proptype))
            return True
        except:
            self.logger.exception('Error setting property {} with values {}'.format(indi_property, property_values))
            return False

    @with_attrs(['indi_device'])
    def get_queued_message(self, message):
        return self.indi_device.get_queued_message(message)

    def __str__(self):
        return 'Camera: {}'.format(self.name)

    def __repr__(self):
        return self.__str__()


