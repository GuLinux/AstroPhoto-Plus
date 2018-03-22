from .model import id_by_properties, with_attrs

class Property:
    def __init__(self, logger, indi_property=None, indi_vector_property=None, indi_device=None, device=None, group=None, name=None, type=None):
        self.logger = logger
        self.name = None
        self.group = None
        self.device = None
        self.indi_device = None
        self.label = None
        self.type = type

        if indi_device and indi_vector_property and type:
            self.__init_by_vector_property(indi_device, indi_vector_property)
        if indi_property and indi_device and type:
            self.__init_by_property(indi_device, indi_property)
        elif name and device and group and type:
            self.__init_by_values(device, group, name)
        else:
            raise RuntimeError('Property initialization error')
        self.id = id_by_properties([self.device, self.group, self.name])
 
    def __init_by_property(self, indi_device, indi_property):
        self.indi_device = indi_device
        self.name = indi_property.getName()
        self.group = indi_property.getGroupName()
        self.device = indi_property.getDeviceName()
        self.label = indi_property.getLabel()

    def __init_by_vector_property(self, indi_device, indi_vector_property):
        self.indi_device = indi_device
        self.name = indi_vector_property.name
        self.group = indi_vector_property.group
        self.device = indi_vector_property.device
        self.label = indi_vector_property.label

    def __init_by_values(self, device, group, name):
        self.device = device
        self.group = group
        self.name = name

