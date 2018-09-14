from models import random_id
from errors import BadRequestError

class INDIProfile:
    def __init__(self, id=None, name='', drivers=[]):
        self.name = name
        self.drivers = drivers
        self.id = random_id(id)

    @staticmethod
    def from_map(json):
        return INDIProfile(**json)

    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'drivers': self.drivers,
        }

    def update(self, data):
        if 'name' not in data and 'drivers' not in data:
            raise BadRequestError('Invalid json: either name or drivers must be specified')
        if 'name' in data:
            self.name = data['name']
        if 'drivers' in data:
            self.drivers = data['drivers']


