import os
import time
from queue import Queue

from errors import BadRequestError
from images import Image, main_images_db
from .exposure_sequence_item_runner import ExposureSequenceItemRunner

from app import logger

import traceback


class ExposureSequenceItem:
    def __init__(self, data):
        self.sequence_item_id = data['id']
        self.filename = data['filename']
        self.count = data['count']
        self.exposure = data['exposure']
        self.directory= data['directory']
        self.progress = data.get('progress', 0)
        self.last_message = data.get('last_message', '')
        self.saved_images = data.get('saved_images', [])
        self.__validate(self.filename)
        self.sequence = None
        
    def __validate(self, format_string):
        test_params = { 'exposure': 1, 'number': 2, 'timestamp': 1, 'datetime': 'date-string', 'filter': 'filter-name', 'filter_index': 1}
        if not os.path.splitext(format_string.lower())[1] in ['.fit', '.fits']:
            raise BadRequestError('Unrecognized file extension')
        try:
            first_string = format_string.format(**test_params)
            test_params['number'] = 200
            if first_string == format_string.format(**test_params):
                raise BadRequestError('"number" parameter not present in format string: {}'.format(format_string))
        except KeyError as e:
            raise BadRequestError('Bad filename template: {} parameter not valid'.format(e.args[0]))

    def reset(self):
        self.progress = 0

    def to_map(self, to_view=False):
        return {
            'count': self.count,
            'exposure': self.exposure,
            'filename': self.filename,
            'directory': self.directory,
            'progress': self.progress,
            'last_message': self.last_message,
            'saved_images': self.saved_images,
        }

    def stop(self):
        if self.sequence:
            self.sequence.stop()
            self.sequence = None
        return 'stopped'

    def run(self, server, devices, root_path, event_listener, on_update, index):
        images_queue = Queue()

        filename_template_params = {
            'timestamp': lambda _: time.time(),
            'datetime': lambda _: time.strftime('%Y-%m-%dT%H:%M:%S-%Z'),
            'filter': 'no-filter',
            'filter_index': -1,
        }
        if 'filter_wheel' in devices and devices['filter_wheel']:
            filename_template_params['filter_index'], filename_template_params['filter'] = devices['filter_wheel'].indi_sequence_filter_wheel().current_filter()

        upload_path = os.path.join(root_path, self.directory)
        self.sequence = ExposureSequenceItemRunner(server, devices['camera'].indi_sequence_camera(), self.exposure, self.count, upload_path, progress=self.progress, filename_template=self.filename, filename_template_params=filename_template_params)

        def on_started(sequence):
            pass

        def on_each_started(sequence, index):
            self.last_message = 'starting exposure {} out of {}'.format(index+1, sequence.count)
            on_update()

        def on_each_finished(sequence, index, filename):
            images_queue.put(Image(path=filename, file_required=False))
            self.last_message = 'finished exposure {} out of {}, saved to {}'.format(index+1, sequence.count, filename)
            self.progress = sequence.finished
            on_update()

        def on_each_saved(sequence, index, filename):
            logger.debug('received file for index {}: {}'.format(index, filename))
            image = None

            while not image or not image.path == filename:
                if image:
                    images_queue.put(image)
                image = images_queue.get()

            self.saved_images.append(image.id)
            main_images_db.add(image)
            on_update()

        def on_finished(sequence):
            self.last_message = 'finished.'
            on_update()
            self.sequence = None

        logger.debug('Starting sequence: {}, upload_path={}'.format(self.sequence, upload_path))
        self.sequence.callbacks.add('on_started', on_started)
        self.sequence.callbacks.add('on_each_started', on_each_started)
        self.sequence.callbacks.add('on_each_finished', on_each_finished)
        self.sequence.callbacks.add('on_each_saved', on_each_saved)
        self.sequence.callbacks.add('on_finished', on_finished)
        try:
            self.sequence.run()
        except:
            self.progress = self.sequence.finished
            raise
        finally:
            self.sequence = None

