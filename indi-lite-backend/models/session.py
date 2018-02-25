import uuid

class Session:
    def __init__(self, name, id=None, sequences=None):
        self.name = name
        self.id = id if id else uuid.uuid4().hex
        self.sequences = sequences if sequences else []


    def to_map(self):
        return {
            "id": self.id,
            "name": self.name,
            "sequences": [x.to_map() for x in self.sequences]
        }

