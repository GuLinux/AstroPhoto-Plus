import uuid
from pyindi_sequence import Sequence
import os
import time
from .exceptions import BadRequestError

class ShotsSequenceItem:
    def __init__(self, data):
        self.filename = data['filename']
        self.count = data['count']
        self.exposure = data['exposure']
        self.directory= data['directory']
        self.progress = data.get('progress', 0)
        self.last_message = data.get('last_message', '')
        try:
            self.filename.format(exposure=1, number=2, timestamp=1, datetime='date-string', filter='filter-name', filter_index=1)
        except:
            raise BadRequestError('Bad filename template')

    def to_map(self):
        return {
            'count': self.count,
            'exposure': self.exposure,
            'filename': self.filename,
            'directory': self.directory,
            'progress': self.progress,
            'last_message': self.last_message,
        }

    def run(self, devices, root_path, logger, on_update):
        filename_template_params = {
            'timestamp': lambda _: time.time(),
            'datetime': lambda _: time.strftime('%Y-%m-%dT%H:%M:%S-%Z'),
            'filter': 'no-filter',
            'filter_index': -1,
        }
        if 'filter-wheel' in devices:
            pass # TODO: get current filter name/index

        upload_path = os.path.join(root_path, self.directory)
        sequence = Sequence(devices['camera'].indi_sequence_camera(), self.exposure, self.count, upload_path, filename_template=self.filename, filename_template_params=filename_template_params)

        def on_started(sequence):
            pass

        def on_each_started(sequence, index):
            self.last_message = 'starting exposure {} out of {}'.format(index+1, sequence.count)
            on_update()

        def on_each_finished(sequence, index, filename):
            self.last_message = 'finished exposure {} out of {}, saved to {}'.format(index+1, sequence.count, filename)
            self.progress = sequence.finished
            on_update()

        def on_finished(sequence):
            self.last_message = 'finished.'
            on_update()

        logger.debug('Starting sequence: {}, upload_path={}'.format(sequence, upload_path))
        sequence.callbacks.add('on_started', on_started)
        sequence.callbacks.add('on_each_started', on_each_started)
        sequence.callbacks.add('on_each_finished', on_each_finished)
        sequence.callbacks.add('on_finished', on_finished)
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

        self.status = data.get('status', 'idle')

    @staticmethod
    def from_map(map_object):
        return SequenceItem(map_object)

    def to_map(self):
        data = {
            'id': self.id,
            'type': self.type,
            'status': self.status,
        }
        data.update(self.job.to_map())
        return data

    def run(self, devices, root_path, logger, on_update):
        self.status = 'running'
        on_update()
        self.job.run(devices, root_path, logger, on_update)
        self.status = 'finished'
        on_update()
