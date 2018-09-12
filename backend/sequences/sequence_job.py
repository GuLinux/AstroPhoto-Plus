from models import random_id
from errors import BadRequestError, SequenceJobStatusError

from .exposure_sequence_job import ExposureSequenceJob
from .filter_wheel_sequence_job import FilterWheelSequenceJob
from .property_sequence_job import PropertySequenceJob
from .command_sequence_job import CommandSequenceJob
import time
from app import logger


class SequenceJob:
    def __init__(self, data):
        self.id = random_id(data.get('id'))
        self.type = data['type']
        data.update({'id': self.id})
        self.job = None
        if self.type == 'shots':
            self.job = ExposureSequenceJob(data)
        elif self.type == 'filter':
            self.job = FilterWheelSequenceJob(data)
        elif self.type == 'property':
            self.job = PropertySequenceJob(data)
        elif self.type == 'command':
            self.job = CommandSequenceJob(data)
        else:
            raise BadRequestError('Invalid sequence job type: {}'.format(self.type))

        self.status = data.get('status', 'idle')
        self.started_ts, self.finished_ts = None, None

    def duplicate(self):
        data = self.to_map()
        data.pop('id')
        if 'status' in data:
            data.pop('status')
        if 'saved_images' in data:
            data.pop('saved_images') # TODO: move from here?
        return SequenceJob(data)

    def stop(self):
        self.status = 'stopping'
        if hasattr(self.job, 'stop'):
            self.status = self.job.stop()
        logger.debug('stop finished: status={}'.format(self.status))


    @staticmethod
    def from_map(map_object):
        return SequenceJob(map_object)

    def to_map(self):
        data = {
            'id': self.id,
            'type': self.type,
            'status': self.status,
        }
        if self.started_ts:
            data['started'] = self.started_ts
        if self.finished_ts:
            data['finished'] = self.finished_ts
            data['elapsed'] = self.finished_ts - self.started_ts

        data.update(self.job.to_map())
        return data

    def reset(self):
        self.status = 'idle'
        self.job.reset()

    def run(self, server, devices, root_path, logger, event_listener, on_update, index):
        self.status = 'running'
        self.started_ts = time.time()
        on_update()
        try:
            self.job.run(server, devices, root_path, event_listener, on_update, index)
            self.status = 'finished'
            self.finished_ts = time.time()
            on_update()
        except SequenceJobStatusError as e:
            self.status = e.status
            logger.debug('Sequence job status changed to {}'.format(e.status))
            on_update()
        except RuntimeError as e: # TODO: specific exception?
            self.status = 'error'
            self.error_message = str(e)
            logger.exception('Error running sequence job')
            raise e

