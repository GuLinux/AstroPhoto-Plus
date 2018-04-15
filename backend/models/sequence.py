import uuid
from .exceptions import NotFoundError
from .sequence_item import SequenceItem

class Sequence:
    def __init__(self, name, upload_path, camera, id=None, sequence_items=None):
        self.name = name
        self.upload_path = upload_path
        self.camera = camera
        self.id = id if id else uuid.uuid4().hex
        self.sequence_items = sequence_items if sequence_items else []

    def item(self, sequence_item_id):
        sequence_item = [x for x in self.sequence_items if x.id == sequence_item_id]
        if sequence_item:
            return sequence_item[0]
        raise NotFoundError()

    @staticmethod
    def from_map(map_object):
        return Sequence(map_object['name'], map_object['directory'], map_object['camera'], id=map_object['id'], sequence_items=[SequenceItem.from_map(x) for x in map_object['sequenceItems']])

    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'camera': self.camera,
            'directory': self.upload_path,
            'sequenceItems': [x.to_map() for x in self.sequence_items]
        }

