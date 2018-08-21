import os, time
from .save_async_fits import SaveAsyncFITS
import tempfile


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


class ExposureSequenceItemRunner:
    def __init__(self, camera, exposure, count, upload_path, progress=0, filename_template='{name}_{exposure}s_{number:04}.fits', filename_template_params={}, **kwargs):
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

    def stop(self):
        self.stopped = True

    def on_saved(self, item):
        self.callbacks.run('on_each_saved', self, item.sequence, item.file_name)

    def run(self):
        self.camera.set_upload_to('local')
        tmp_prefix = '__sequence_TMP'
        tmp_upload_path = tempfile.gettempdir()
        tmp_file = os.path.join(tmp_upload_path, tmp_prefix + '.fits')

        save_async_fits = SaveAsyncFITS(on_saved=self.on_saved)

        self.camera.set_upload_path(tmp_upload_path, tmp_prefix)
        self.callbacks.run('on_started', self)

        try:
            for sequence in range(self.finished, self.count):
                if self.stopped:
                    self.callbacks.run('on_stopped', self, sequence)
                    save_async_fits.join()
                    return

                self.callbacks.run('on_each_started', self, sequence)
                temp_before = self.ccd_temperature
                time_started = time.time()
                self.camera.shoot(self.exposure)
                temp_after = self.ccd_temperature
                time_finished = time.time()
                
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



                unique_temp_file = os.path.join(tmp_upload_path, '__seq_tmp_{}'.format(time_finished))
                os.rename(tmp_file, unique_temp_file)

                self.finished += 1
                self.callbacks.run('on_each_finished', self, sequence, output_file)

                save_async_fits.put({
                    'type': 'exposure_finished',
                    'number': sequence+1,
                    'exposure': self.exposure,
                    'time_started': time_started,
                    'time_finished': time_finished,
                    'temperature_started': temp_before,
                    'temperature_finished': temp_after,
                    'temp_filename': unique_temp_file,
                    'output_file': output_file,
                })

        finally:
            save_async_fits.finished()

        # Note: this means we wait for *all* images in this sequences to be saved, before starting the next sequence. Which might be a bottleneck, but then again, if you're shooting much faster than you can save, then you probably have a bigger issue...
        self.callbacks.run('on_finished', self)

    @property
    def ccd_temperature(self):
        if self.camera.has_control('CCD_TEMPERATURE', 'number'):
            return self.camera.values('CCD_TEMPERATURE', 'number')['CCD_TEMPERATURE_VALUE']
        return None

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
        return 'ExposureSequenceItemRunner: {0} {1}s exposure (total exp time: {2}s), start index: {3}'.format(self.count,
                                                                                                 self.exposure,
                                                                                                 self.total_seconds,
                                                                                                 self.start_index)

    def __repr__(self):
        return self.__str__()

