import os, time
from .save_async_fits import SaveAsyncFITS
from app import logger
from pyindi_sequence import INDIClient
from utils.threads import start_thread, thread_queue, lock
from errors import SequenceJobStatusError 
from indi.blob_client import BLOBError
import json



class SequenceCallbacks:
    def __init__(self, **kwargs):
        self.callbacks = kwargs

    def add(self, name, callback):
        if name not in self.callbacks:
            self.callbacks[name] = []
        self.callbacks[name].append(callback)

    def run(self, name, *args, **kwargs):
        if name not in self.callbacks:
            return
        for callback in self.callbacks[name]:
            callback(*args, **kwargs)

class Shot:
    def __init__(self, number, exposure, filename, camera=None, blob_listener=None):
        self.number = number
        self.exposure = exposure
        self.filename = filename
        self.blob, self.time_started, self.time_finished, self.temperature_started, self.temperature_finished = (None,) * 5
        if camera and blob_listener:
            self.shoot(camera, blob_listener)

    def shoot(self, camera, blob_listener):
        self.time_started = time.time()
        self.temperature_started = self.__ccd_temperature(camera)
        camera.shoot(self.exposure)
        self.time_finished = time.time()
        self.temperature_finished = self.__ccd_temperature(camera)
        self.blob = blob_listener.get()
        logger.debug('shoot: {}'.format(self))

    def save(self):
        logger.debug('save: {}'.format(self))
        info_json = os.path.join(os.path.dirname(self.filename), 'info', os.path.basename(self.filename) + '.json')
        os.makedirs(os.path.dirname(info_json), exist_ok=True)
        info = {
            'exposure': self.exposure,
            'number': self.number,
            'time_started': self.time_started,
            'time_finished': self.time_finished,
        }
        if self.temperature_started is not None:
            info.update({ 'temperature_started': self.temperature_started })
        if self.temperature_finished is not None:
            info.update({ 'temperature_finished': self.temperature_started })
        if self.temperature_started is not None and self.temperature_finished is not None:
            info.update({ 'temperature_average': (self.temperature_started + self.temperature_finished) / 2 })
        with open(info_json, 'w') as info_file:
            json.dump(info, info_file)

        self.blob.save(self.filename)

    def __ccd_temperature(self, camera):
        if camera.has_control('CCD_TEMPERATURE', 'number'):
            return camera.values('CCD_TEMPERATURE', 'number')['CCD_TEMPERATURE_VALUE']
        return None


    def __str__(self):
        s = 'Shot[number={}, exposure={}, filename='.format(self.number, self.exposure, self.filename)
        if self.blob:
            s += ', blob={} bytes'.format(self.blob.size)
        if self.temperature_started:
            s += ', temperature_started={}'.format(self.temperature_started)
        if self.temperature_finished:
            s += ', temperature_finished={}'.format(self.temperature_finished)
        if self.time_started:
            s += ', time_started={}'.format(self.time_started)
        if self.time_finished:
            s += ', time_finished={}'.format(self.time_finished)
        s += ']'
        return s

    def __repr__(self):
        return self.__str__()

class ExposureSequenceJobRunner:
    def __init__(self, server, camera, exposure, count, upload_path, progress=0, filename_template='{name}_{exposure}s_{number:04}.fits', filename_template_params={}, **kwargs):
        self.camera = camera
        self.count = count
        self.exposure = exposure
        self.upload_path = upload_path
        self.callbacks = SequenceCallbacks(**kwargs)
        self.finished = progress
        self.start_index = 1
        self.filename_template = filename_template
        self.filename_template_params = filename_template_params
        if not os.path.isdir(upload_path):
            os.makedirs(upload_path)
        self.__next_index = self.finished
        self.stopped = False
        self.error = None
        self.server = server
        self.save_async_fits = SaveAsyncFITS(on_saved=self.on_saved, on_error=self.on_error)
        self.lock = lock()

    def stop(self):
        with self.lock:
            self.stopped = True
            self.save_async_fits.stopped()

    def on_saved(self, item):
        self.callbacks.run('on_each_saved', self, item.sequence, item.file_name)

    def on_error(self, error, item_number):
        logger.warning('{}: {}'.format(error, item_number))
        self.error = (error, item_number)

    def run(self):
        # TODO: fix
        from system import controller
        self.stopped = False
        self.error = None
        self.camera.set_upload_to('client')

        self.callbacks.run('on_started', self)



        def check_for_error():
            if self.error:
                if self.error[1]:
                    self.finished = self.error[1] -1
                raise RuntimeError(self.error[0])

        try:

            with controller.indi_server.blob_client.listener(self.camera) as blob_listener:
                for sequence in range(self.finished, self.count):
                    with self.lock:
                        logger.info('Running sequence item {} of {}, stopped={}, error={}'.format(sequence, self.count, self.stopped, self.error))
                        if self.stopped:
                            self.callbacks.run('on_stopped', self, sequence)
                            break
                        check_for_error()
                        self.callbacks.run('on_each_started', self, sequence)

                        filename = self.__output_file(sequence)
                        shot = Shot(sequence, self.exposure, filename, self.camera, blob_listener)
                        self.save_async_fits.put(shot)

                        self.finished += 1
                        self.callbacks.run('on_each_finished', self, sequence, filename)
        except Exception as e:
            self.error = (e,self.finished)
            logger.warning('Exception on shot')
            raise
        finally:
            logger.info('** sequence run exiting: stopped={}, error={}'.format(self.stopped, self.error))
            check_for_error()
            if not self.stopped and not self.error:
                self.save_async_fits.finished()
                logger.debug('*** sequence run: calling on_finished')
                self.callbacks.run('on_finished', self)

    def __output_file(self, sequence):
        format_params = { 'exposure': self.exposure, 'number': sequence + self.start_index}
        format_params.update(self.filename_template_params)

        for key, value in format_params.items():
            if callable(value):
                format_params[key] = value(self)

        file_name = os.path.join(self.upload_path, self.filename_template.format(**format_params))

        file_suffix_to_skip_overwriting = 1
        output_file = file_name
        while os.path.isfile(output_file):
            filepath, extension = os.path.splitext(file_name)
            output_file = '{}__{}{}'.format(filepath, file_suffix_to_skip_overwriting, extension)
            file_suffix_to_skip_overwriting += 1
        return output_file


    @property
    def total_seconds(self):
        return self.exposure * self.count

    @property
    def shot_seconds(self):
        return self.finished * self.exposure

    @property
    def remaining_seconds(self):
        return self.remaining_shots * self.exposure

    @property
    def remaining_shots(self):
        return self.count - self.finished

    @property
    def next_index(self):
        return self.finished + self.start_index

    @property
    def last_index(self):
        return self.next_index - 1

    def __str__(self):
        return 'ExposureSequenceJobRunner: {0} {1}s exposure (total exp time: {2}s), start index: {3}'.format(self.count,
                                                                                                 self.exposure,
                                                                                                 self.total_seconds,
                                                                                                 self.start_index)

    def __repr__(self):
        return self.__str__()

