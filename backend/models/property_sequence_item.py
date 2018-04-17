from .exceptions import NotFoundError 


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

    def run(self, server, devices, root_path, logger, on_update):
        device = [d for d in devices['all'] if d.id == self.device]
        if not device:
            raise NotFoundError('Device with id {} not found'.format(self.device)
        device = device[0]
        indi_device = device.find_indi_device()


