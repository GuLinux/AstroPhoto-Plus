import os, time
from .save_async_fits import SaveAsyncFITS
import tempfile
from app import logger
from pyindi_sequence import INDIClient
from queue import Queue
import threading


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
        self.server = server

    def stop(self):
        self.stopped = True

    def on_saved(self, item):
        self.callbacks.run('on_each_saved', self, item.sequence, item.file_name)

    def run(self):
        self.camera.set_upload_to('client')

        self.callbacks.run('on_started', self)

        shots_queue = Queue()
        blob_watcher = threading.Thread(target=self.__blob_watcher, args=(shots_queue,))
        blob_watcher.start()

        try:
            for sequence in range(self.finished, self.count):
                if self.stopped:
                    self.callbacks.run('on_stopped', self, sequence)
                    shots_queue.put({'type': 'stopped'})
                    return

                self.callbacks.run('on_each_started', self, sequence)
                shots_queue.put({
                    'type': 'shot',
                    'index': sequence,
                })
                self.camera.shoot(self.exposure)

                self.finished += 1
                self.callbacks.run('on_each_finished', self, sequence, self.__output_file(sequence))

        finally:
            shots_queue.put({'type': 'finished'})



        # Note: this means we wait for *all* images in this sequences to be saved, before starting the next sequence. Which might be a bottleneck, but then again, if you're shooting much faster than you can save, then you probably have a bigger issue...
        self.callbacks.run('on_finished', self)


    def __blob_watcher(self, shots_queue):
        finished = False
        save_async_fits = SaveAsyncFITS(on_saved=self.on_saved)
        indi_host, indi_port = self.server.client.host, self.server.client.port

        blobs_queue = Queue()
        def on_new_blob(bp):
            blob_info = 'name={}, label={}, format={}, bloblen={}, size={}'.format(bp.name, bp.label, bp.format, bp.bloblen, bp.size)
            blobs_queue.put(bp)

        indi_client = INDIClient(address=indi_host, port=indi_port, callbacks={
            'on_new_blob': on_new_blob,
        }, autoconnect=False)


        def on_new_property(device, group, property_name):
            indi_client.setBLOBMode(1, device, None)

        indi_client.callbacks['on_new_property'] = on_new_property 

        indi_client.connectServer()

        while not finished:
            received_blob = None
            item = shots_queue.get()
            if item['type'] == 'finished':
                finished = True
                save_async_fits.finished()
            elif item['type'] == 'stopped':
                save_async_fits.join()
            elif item['type'] == 'shot':
                time_started = time.time()
                temp_before = self.ccd_temperature
                blob = blobs_queue.get()
                temp_after = self.ccd_temperature
                time_finished = time.time()

                save_async_fits.put({
                    'type': 'exposure_finished',
                    'number': item['index'] + self.start_index,
                    'exposure': self.exposure,
                    'time_started': time_started,
                    'time_finished': time_finished,
                    'temperature_started': temp_before,
                    'temperature_finished': temp_after,
                    'output_file': self.__output_file(item['index']),
                    'blob': blob.getblobdata(),
                })

        indi_client.disconnectServer()


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


    def __blob_watcher(self, shots_queue):
        finished = False
        indi_host, indi_port = self.server.client.host, self.server.client.port
        logger.debug('**** starting secondary indi client: host={}, port={}'.format(indi_host, indi_port))
        blobs_queue = Queue()
        def on_new_blob(bp):
            blob_info = 'name={}, label={}, format={}, bloblen={}, size={}'.format(bp.name, bp.label, bp.format, bp.bloblen, bp.size)
            logger.debug('******** got new blob! {}'.format(blob_info))
            blobs_queue.put(bp)

        indi_client = INDIClient(address=indi_host, port=indi_port, callbacks={
            'on_new_blob': on_new_blob,
        }, autoconnect=False)


        def on_new_property(device, group, property_name):
            indi_client.setBLOBMode(1, device, None)

        indi_client.callbacks['on_new_property'] = on_new_property 

        indi_client.connectServer()

        while not finished:
            received_blob = None
            item = shots_queue.get()
            if item['type'] == 'finished':
                finished = True
            elif item['type'] == 'shot':
                time_started = time.time()
                blob = blobs_queue.get()
                temp_after = self.ccd_temperature
                time_finished = time.time()
                logger.debug('**** now saving blob')
        indi_client.disconnectServer()




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

