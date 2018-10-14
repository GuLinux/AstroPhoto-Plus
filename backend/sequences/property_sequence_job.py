from indi import Property
from app import logger
import time

class PropertySequenceJob:
    def __init__(self, data):
        self.device = data['device']
        self.property = data['property']
        self.values = data['values']
        self.wait = data.get('wait', 0)
       
    def to_map(self):
        return {
            'device': self.device,
            'property': self.property,
            'values': self.values,
            'wait': self.wait,
        }

    def run(self, server, devices, root_path, event_listener, on_update, index):
        property = server.property(device=self.device, name=self.property)
        sync = self.wait != 0
        timeout = self.wait if self.wait > 0 else 999999999
        property.set_values(self.values, sync=sync, timeout=timeout)

    def reset(self, remove_files=False):
        pass

