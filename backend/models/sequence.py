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

    def run(self, server, root_directory, logger, callbacks):
        camera = [c for c in server.cameras() if c.id == self.camera]
        if not camera:
            raise NotFoundError('Camera with id {} not found'.format(self.camera))
        camera = camera[0]
        logger.debug('Starting sequence with camera: {}={}'.format(self.camera, camera.device.name))

        for sequence_item in self.sequence_items:
            sequence_item.run({'camera': camera}, root_directory, self.upload_path, logger, callbacks)
