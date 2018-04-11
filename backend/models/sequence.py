import uuid

class Sequence:
    def __init__(self, name, upload_path, camera, id=None, sequence_items=None):
        self.name = name
        self.upload_path = upload_path
        self.camera = camera
        self.id = id if id else uuid.uuid4().hex
        self.sequence_items = sequence_items if sequence_items else []


    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'camera': self.camera,
            'directory': self.upload_path,
            'sequenceItems': [x.to_map() for x in self.sequence_items]
        }

