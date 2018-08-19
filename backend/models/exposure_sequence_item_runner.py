import os, time
from astropy.io import fits
import threading
import shutil
import functools
import tempfile
import multiprocessing
from argparse import Namespace
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


def process_sequence_files(input_queue, notify_queue):
    finished = False
    while not finished:
        item = Namespace(**input_queue.get())
        if item.type == 'finish':
            finished = True
        elif item.type == 'exposure_finished':
            info_json = os.path.join(os.path.dirname(item.output_file), os.path.basename(item.output_file) + '.json')
            info = {
                'exposure': item.exposure,
                'number': item.number,
                'time_started': item.time_started,
                'time_finished': item.time_finished,
            }
            if item.temperature_started is not None:
                info.update({ 'temperature_started': item.temperature_started })
            if item.temperature_finished is not None:
                info.update({ 'temperature_finished': item.temperature_started })
            if item.temperature_started is not None and item.temperature_finished is not None:
                info.update({ 'temperature_average': (item.temperature_started + item.temperature_finished) / 2 })
            with open(info_json, 'w') as info_file:
                json.dump(info, info_file)

            temp_move_file = os.path.join(os.path.dirname(item.output_file), os.path.basename(item.temp_filename))
            shutil.move(item.temp_filename, temp_move_file)
            os.rename(temp_move_file, item.output_file)
            notify_queue.put({
                'type': 'each_finished',
                'sequence': item.number,
                'file_name': item.output_file,
            })
    notify_queue.put({ 'type': 'finish' })


class ExposureSequenceItemRunner:

    def __init__(self, camera, exposure, count, upload_path, start_index=1, name=None, filename_template='{name}_{exposure}s_{number:04}.fits', filename_template_params={}, **kwargs):
        self.camera = camera
        self.count = count
        self.exposure = exposure
        self.upload_path = upload_path
        self.callbacks = SequenceCallbacks(**kwargs)
        self.finished = 0
        self.start_index = start_index
        self.name = name
        self.filename_template = filename_template
        self.filename_template_params = filename_template_params
        if not os.path.isdir(upload_path):
            os.makedirs(upload_path)
        self.max_threads = multiprocessing.cpu_count() + 1
        self.async_move_threads = [None] * self.max_threads
        self.__next_index = 0

    def __notify_sequence_finished(self, notify_queue):
        finished = False
        while not finished:
            item = Namespace(**notify_queue.get())
            if item.type == 'finish':
                finished = True
            elif item.type == 'each_finished':
                self.callbacks.run('on_each_saved', self, item.sequence, item.file_name)

    def run(self):
        self.camera.set_upload_to('local')
        tmp_prefix = self.name + 'TMP' if self.name else '__sequence_TMP'
        tmp_upload_path = tempfile.gettempdir()
        tmp_file = os.path.join(tmp_upload_path, tmp_prefix + '.fits')

        files_queue = multiprocessing.Queue()
        notify_queue = multiprocessing.Queue()

        process_files = multiprocessing.Process(target=process_sequence_files, args=(files_queue, notify_queue))
        notify_thread = threading.Thread(target=self.__notify_sequence_finished, args=(notify_queue,))

        self.camera.set_upload_path(tmp_upload_path, tmp_prefix)
        self.callbacks.run('on_started', self)

        process_files.start()
        notify_thread.start()

        try:
            for sequence in range(0, self.count):
                self.callbacks.run('on_each_started', self, sequence)
                # Check for 'pause' file
                while os.path.isfile(os.path.join(self.upload_path, 'pause')):
                    time.sleep(0.5)

                temp_before = self.ccd_temperature
                time_started = time.time()
                self.camera.shoot(self.exposure)
                temp_after = self.ccd_temperature
                time_finished = time.time()
                
                format_params = { 'name': self.name, 'exposure': self.exposure, 'number': sequence + self.start_index}
                format_params.update(self.filename_template_params)

                for key, value in format_params.items():
                    if callable(value):
                        format_params[key] = value(self)

                file_name = os.path.join(self.upload_path, self.filename_template.format(**format_params))
                unique_temp_file = os.path.join(tmp_upload_path, '__seq_tmp_{}'.format(time_finished))
                os.rename(tmp_file, unique_temp_file)

                self.finished += 1
                self.callbacks.run('on_each_finished', self, sequence, file_name)

                files_queue.put({
                    'type': 'exposure_finished',
                    'number': sequence+1,
                    'exposure': self.exposure,
                    'time_started': time_started,
                    'time_finished': time_finished,
                    'temperature_started': temp_before,
                    'temperature_finished': temp_after,
                    'temp_filename': unique_temp_file,
                    'output_file': file_name,
                })

        finally:
            files_queue.put({ 'type': 'finish' })
            process_files.join()
            notify_thread.join()

        # Note: this means we wait for *all* images in this sequences to be saved, before starting the next sequence. Which might be a bottleneck, but then again, if you're shooting much faster than you can save, then you probably have a bigger issue...
        self.callbacks.run('on_finished', self)

    def __start_thread_move(self, tmp_file, file_name, temperature):
        if self.max_threads == 0:
            self.__move_tmp_file(tmp_file, file_name, temperature)
        else:
            async_move_thread = threading.Thread(target=functools.partial(ExposureSequenceItemRunner.__move_tmp_file, self, tmp_file, file_name, temperature))
            async_move_thread.start()
            if self.async_move_threads[self.__next_index]:
                self.async_move_threads[self.__next_index].join()
            self.async_move_threads[self.__next_index] = async_move_thread
            self.__next_index = (self.__next_index + 1) % self.max_threads

    def __move_tmp_file(self, temp_file, dest_file, temperature=None):
        # If temp_file and dest_file are on different filesystems (like /tmp and $HOME), the move will take some time, potentially clashing with the next capture.
        temp_unique_file = os.path.join(os.path.dirname(temp_file), os.path.basename(dest_file))
        # First, do a "fast" rename within the same filesystem, in order to free the temporary global file
        shutil.move(temp_file, temp_unique_file)
        
        # Write the average CCD temperature, if not present
        if temperature is not None:
            with fits.open(temp_unique_file, mode='append') as fits_file:
                if 'CCD-TEMP' not in fits_file[0].header:
                    fits_file[0].header['CCD-TEMP'] = (temperature, 'CCD Temperature (Celsius)')
                    fits_file.writeto(temp_unique_file, overwrite=True)


        # Then run the slower cross-fs move (cp + rm)
        shutil.move(temp_unique_file, dest_file)


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
        return 'ExposureSequenceItemRunner {0}: {1} {2}s exposure (total exp time: {3}s), start index: {4}'.format(self.name, self.count,
                                                                                                 self.exposure,
                                                                                                 self.total_seconds,
                                                                                                 self.start_index)

    def __repr__(self):
        return self.__str__()

