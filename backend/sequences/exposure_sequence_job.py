import os
import time
from queue import Queue

from errors import BadRequestError
from images import Image, main_images_db
from .exposure_sequence_job_runner import ExposureSequenceJobRunner

from app import logger

import traceback


class ExposureSequenceJob:
    def __init__(self, data):
        self.sequence_job_id = data['id']
        self.filename = data['filename']
        self.count = data['count']
        self.exposure = data['exposure']
        self.directory= data['directory']
        self.progress = data.get('progress', 0)
        self.last_message = data.get('last_message', '')
        self.saved_images = data.get('saved_images', [])
        self.__validate(self.filename)
        self.job_runner = None
        
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
        if self.job_runner:
            self.job_runner.stop()
            self.job_runner = None
        return 'stopped'

    def run(self, server, devices, root_path, event_listener, on_update, index):
        filename_template_params = {
            'timestamp': lambda _: time.time(),
            'datetime': lambda _: time.strftime('%Y-%m-%dT%H:%M:%S-%Z'),
            'filter': 'no-filter',
            'filter_index': -1,
        }
        if 'filter_wheel' in devices and devices['filter_wheel']:
            filename_template_params['filter_index'], filename_template_params['filter'] = devices['filter_wheel'].indi_sequence_filter_wheel().current_filter()

        upload_path = os.path.join(root_path, self.directory)
        self.job_runner = ExposureSequenceJobRunner(server, devices['camera'].indi_sequence_camera(), self.exposure, self.count, upload_path, progress=self.progress, filename_template=self.filename, filename_template_params=filename_template_params)

        def on_started(job_runner):
            pass

        def on_each_started(job_runner, index):
            self.last_message = 'starting exposure {} out of {}'.format(index+1, job_runner.count)
            on_update()

        def on_each_finished(job_runner, index, filename):
            self.last_message = 'finished exposure {} out of {}, saved to {}'.format(index+1, job_runner.count, filename)
            on_update()

        def on_each_saved(job_runner, index, filename):
            logger.info('received file for index {}: {}'.format(index, filename))

            image = Image(path=filename, file_required=False)
            self.progress = job_runner.finished
            self.saved_images.append(image.id)
            main_images_db.add(image)
            on_update()

        def on_finished(job_runner):
            self.last_message = 'finished.'
            on_update()
            self.progress = job_runner.finished
            self.job_runner = None

        logger.info('Starting job runner: {}, upload_path={}'.format(self.job_runner, upload_path))
        self.job_runner.callbacks.add('on_started', on_started)
        self.job_runner.callbacks.add('on_each_started', on_each_started)
        self.job_runner.callbacks.add('on_each_finished', on_each_finished)
        self.job_runner.callbacks.add('on_each_saved', on_each_saved)
        self.job_runner.callbacks.add('on_finished', on_finished)
        try:
            self.job_runner.run()
        except:
            if self.job_runner:
                self.progress = self.job_runner.finished
            logger.warning('Error running exposures job')
            raise
        finally:
            self.job_runner = None


