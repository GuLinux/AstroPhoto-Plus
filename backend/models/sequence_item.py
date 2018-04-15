import uuid
from pyindi_sequence import Sequence
import os

class ShotsSequenceItem:
    def __init__(self, data):
        self.filename = data['filename']
        self.count = data['count']
        self.exposure = data['exposure']
        self.directory= data['directory']

    def to_map(self):
        return {
            'count': self.count,
            'exposure': self.exposure,
            'filename': self.filename,
            'directory': self.directory,
        }

    def run(self, devices, root_path, parent_path, logger, callbacks):
        upload_path = os.path.join(root_path, parent_path, self.directory)
        sequence = Sequence(devices['camera'].indi_sequence_camera(), self.exposure, self.count, upload_path, filename_template=self.filename)
        logger.debug('Starting sequence: {}, upload_path={}'.format(sequence, upload_path))
        for key, value in callbacks:
            sequence.callbacks.add(key, value)
        sequence.run()

class SequenceItem:
    def __init__(self, data):
        self.filename = data['filename']
        self.id = data['id'] if 'id' in data else uuid.uuid4().hex
        self.type = data['type']
        self.job = None
        if self.type == 'shots':
            self.job = ShotsSequenceItem(data)
        else:
            raise BadRequestError('Invalid sequence item type: {}'.format(self.type))

    @staticmethod
    def from_map(map_object):
        return SequenceItem(map_object)

    def to_map(self):
        data = {
            "id": self.id,
            "type": self.type,
        }
        data.update(self.job.to_map())
        return data


    def run(self, *args, **kwargs):
        self.job.run(*args, **kwargs)

