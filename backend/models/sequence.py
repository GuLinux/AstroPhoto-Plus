import uuid

class Sequence:
    def __init__(self, name, camera, id=None, sequence_items=None):
        self.name = name
        self.camera = camera
        self.id = id if id else uuid.uuid4().hex
        self.sequence_items = sequence_items if sequence_items else []


    def to_map(self):
        return {
            "id": self.id,
            "name": self.name,
            "camera": self.camera,
            "sequenceItems": [x.to_map() for x in self.sequence_items]
        }

