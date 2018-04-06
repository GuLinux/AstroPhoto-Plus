import uuid

class ShotsSequenceItem:
    def __init__(self, data):
        self.count = data['shots']
        self.exposure = data['exposure']

    def to_map(self):
        return {
            'shots': self.count,
            'exposure': self.exposure,
        }

class SequenceItem:
    def __init__(self, data):
        self.name = data['name']
        self.id = data['id'] if 'id' in data else uuid.uuid4().hex
        self.type = data['type']
        self.job = None
        if self.type == 'shots':
            self.job = ShotsSequenceItem(data)
        else:
            raise BadRequestError('Invalid sequence item type: {}'.format(self.type))

    

    def to_map(self):
        data = {
            "id": self.id,
            "name": self.name,
        }
        data.update(self.job.to_map())
        return data

