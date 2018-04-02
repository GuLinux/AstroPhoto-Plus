import uuid

class SequenceItem:
    def __init__(self, name, id=None):
        self.name = name
        self.id = id if id else uuid.uuid4().hex


    def to_map(self):
        return {
            "id": self.id,
            "name": self.name
        }

