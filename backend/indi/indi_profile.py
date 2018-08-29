from models import random_id
from errors import BadRequestError

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
        if 'name' not in data and 'devices' not in data:
            raise BadRequestError('Invalid json: either name or devices must be specified')
        if 'name' in data:
            self.name = data['name']
        if 'devices' in data:
            self.devices = data['devices']


