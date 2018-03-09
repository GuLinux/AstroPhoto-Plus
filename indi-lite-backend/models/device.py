class Device:
    def __init__(self, indi_device):
        self.indi_device = indi_device

    @property
    def name(self):
        return self.indi_device.name

    def to_map(self):
        return {
            'name': self.name
        }

    def properties(self):
        return self.indi_device.get_properties()

    def __str__(self):
        return 'Camera: {}'.format(self.name)

    def __repr__(self):
        return self.__str__()

