from models import random_id
from errors import NotFoundError, BadRequestError
from .sequence_item import SequenceItem
import os
from app import logger

class Sequence:
    def __init__(self, name, upload_path, camera, filter_wheel=None, id=None, sequence_items=None, status=None):
        self.name = name
        self.upload_path = upload_path
        self.camera = camera
        self.filter_wheel = filter_wheel
        self.id = random_id(id)
        self.sequence_items = sequence_items if sequence_items else []
        self.status = status if status else 'idle'
        self.running_sequence_item = None

    def item(self, sequence_item_id):
        sequence_item = [x for x in self.sequence_items if x.id == sequence_item_id]
        if sequence_item:
            return sequence_item[0]
        raise NotFoundError()

    def update(self, json):
        self.name = json['name']
        self.upload_path = json['directory']
        self.camera = json['camera']
        self.filter_wheel = json['filterWheel']

    @staticmethod
    def from_map(map_object):
        return Sequence(
            map_object['name'],
            map_object['directory'],
            map_object['camera'],
            map_object['filterWheel'],
            id=map_object['id'],
            sequence_items=[SequenceItem.from_map(x) for x in map_object['sequenceItems']],
            status=map_object['status']
        )

    @staticmethod
    def import_from_data(data):
        data['id'] = random_id()
        for item in data['sequenceItems']:
            item['id'] = random_id()
        return Sequence.from_map(data)

    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'camera': self.camera,
            'filterWheel': self.filter_wheel,
            'directory': self.upload_path,
            'sequenceItems': [x.to_map() for x in self.sequence_items],
            'status': self.status,
        }

    def is_running(self):
        return self.status == 'running'

    def duplicate(self):
        new_sequence = Sequence(self.name + ' (copy)', self.upload_path + ' (copy)', self.camera, self.filter_wheel)
        for item in self.sequence_items:
            new_sequence.sequence_items.append(item.duplicate())

        return new_sequence

    def stop(self, on_update=None):
        if not self.is_running() or not self.running_sequence_item:
            raise BadRequestError('Sequence not running')
        self.status = 'stopped'
        self.running_sequence_item.stop()
        if on_update:
            on_update()


    def reset(self):
        for sequence_item in self.sequence_items:
            self.status = 'idle'
            logger.debug('resetting sequence item {}'.format(sequence_item))
            sequence_item.reset()

    def run(self, server, root_directory, event_listener, logger, on_update=None):
        camera = [c for c in server.cameras() if c.id == self.camera]
        if not camera:
            raise NotFoundError('Camera with id {} not found'.format(self.camera))
        camera = camera[0]

        filter_wheel = None
        if self.filter_wheel:
            filter_wheel = [f for f in server.filter_wheels() if f.id == self.filter_wheel]
            if not filter_wheel:
                raise NotFoundError('Filter wheel with id {} not found'.format(self.filter_wheel))
            filter_wheel = filter_wheel[0]

        sequence_root_path = os.path.join(root_directory, self.upload_path)

 
        logger.debug('Starting sequence with camera: {}={} and filter_wheel: {}={}'.format(self.camera, camera.device.name, self.filter_wheel, filter_wheel.device.name if filter_wheel else 'N/A'))

        self.status = 'starting'

        for sequence_item in self.sequence_items:
            if self.is_todo(sequence_item) and sequence_item.status != 'stopped':
                logger.debug('resetting sequence item {}'.format(sequence_item))
                sequence_item.reset()

        on_update()
        try:
            os.makedirs(sequence_root_path, exist_ok=True)

            self.status = 'running'
            for index, sequence_item in enumerate(self.sequence_items):
                if self.status == 'stopped':
                    return
                if self.is_todo(sequence_item):
                    self.running_sequence_item = sequence_item
                    sequence_item.run(server, {'camera': camera, 'filter_wheel': filter_wheel}, sequence_root_path, logger, event_listener, on_update, index=index)
            self.status = 'finished'
            on_update()
        except Exception as e:
            logger.exception('error running sequence')
            self.status = 'error'
            on_update()
            raise e
        finally:
            self.running_sequence_item = None

    def is_todo(self, sequence_item):
        return sequence_item.status != 'finished'
