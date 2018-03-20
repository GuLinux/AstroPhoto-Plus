class Device:
    def __init__(self, indi_device, logger):
        self.indi_device = indi_device
        self.logger = logger

    @property
    def name(self):
        return self.indi_device.name

    def to_map(self):
        return {
            'name': self.name
        }

    def properties(self):
        return self.indi_device.get_properties()

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

                self.indi_device.set_switch(indi_property['name'], on_switches, off_switches)
            elif proptype == 'number':
                self.indi_device.set_number(indi_property['name'], property_values)
            elif proptype == 'text':
                self.indi_device.set_text(indi_property['name'], property_values)
            else:
                raise RuntimeError('Property type unsupported: {}'.format(proptype))
            return True
        except:
            self.logger.exception('Error setting property {} with values {}'.format(indi_property, property_values))
            return False

    def get_queued_message(self, message):
        return self.indi_device.get_queued_message(message)

    def __str__(self):
        return 'Camera: {}'.format(self.name)

    def __repr__(self):
        return self.__str__()

