from .model import random_id

class INDIProfile:
    def __init__(self, id=None, name='', devices=[]):
        self.name = name
        self.devices = devices
        self.id = random_id(id)

    @staticmethod
    def from_map(json):
        return INDIProfile(**json)

    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'devices': self.devices,
        }

    def update(self, data):
        self.name = data['name']
        self.devices = data['devices']


