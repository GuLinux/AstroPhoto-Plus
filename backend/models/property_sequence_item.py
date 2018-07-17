from .indi_property import Property


class PropertySequenceItem:
    def __init__(self, data):
        self.device = data['device']
        self.property = data['property']
        self.values = data['values']
       
    def to_map(self):
        return {
            'device': self.device,
            'property': self.property,
            'values': self.values,
        }

    def run(self, server, devices, root_path, event_listener, logger, on_update, index):
        property = server.property(device=self.device, name=self.property)
        property.set_values(self.values)

    def reset(self):
        pass

