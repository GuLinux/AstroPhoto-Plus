import os
import time
from .exceptions import BadRequestError
from pyindi_sequence import Sequence


class ExposureSequenceItem:
    def __init__(self, data):
        self.filename = data['filename']
        self.count = data['count']
        self.exposure = data['exposure']
        self.directory= data['directory']
        self.progress = data.get('progress', 0)
        self.last_message = data.get('last_message', '')
        self.__validate(self.filename)
        
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

    def to_map(self):
        return {
            'count': self.count,
            'exposure': self.exposure,
            'filename': self.filename,
            'directory': self.directory,
            'progress': self.progress,
            'last_message': self.last_message,
        }

    def run(self, server, devices, root_path, logger, on_update):
        self.progress = 0

        filename_template_params = {
            'timestamp': lambda _: time.time(),
            'datetime': lambda _: time.strftime('%Y-%m-%dT%H:%M:%S-%Z'),
            'filter': 'no-filter',
            'filter_index': -1,
        }
        print(devices)
        if 'filter_wheel' in devices:
            filename_template_params['filter_index'], filename_template_params['filter'] = devices['filter_wheel'].indi_sequence_filter_wheel().current_filter()

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


