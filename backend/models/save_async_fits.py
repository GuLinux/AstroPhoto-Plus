import threading
import os
import multiprocessing
from argparse import Namespace
import json
import shutil

from app import logger


class SaveAsyncFITS:
    def __init__(self, on_saved=None):
        self.files_queue = multiprocessing.Queue()
        self.notify_queue = multiprocessing.Queue()

        self.process_files = multiprocessing.Process(target=self.__process_sequence_files, args=(self.files_queue, self.notify_queue))
        self.notify_thread = threading.Thread(target=self.__notify_sequence_finished, args=(self.notify_queue,))

        self.process_files.start()
        self.notify_thread.start()

        self.on_saved = on_saved



    def join(self):
        self.process_files.join()
        self.notify_thread.join()

    def put(self, shot):
        self.files_queue.put(shot)

    def finished(self):
        self.files_queue.put({ 'type': 'finish' })
        self.join()

 
    def __notify_sequence_finished(self, notify_queue):
        finished = False
        while not finished:
            item = Namespace(**notify_queue.get())
            if item.type == 'finish':
                finished = True
            elif item.type == 'each_finished':
                if self.on_saved:
                    self.on_saved(item)

    def __process_sequence_files(self, input_queue, notify_queue):
        finished = False
        while not finished:
            item = Namespace(**input_queue.get())
            if item.type == 'finish':
                finished = True
            elif item.type == 'exposure_finished':
                output_file = item.output_file
                info_json = os.path.join(os.path.dirname(output_file), 'info', os.path.basename(output_file) + '.json')
                os.makedirs(os.path.dirname(info_json), exist_ok=True)
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

                with open(output_file, 'wb') as fits_file:
                    fits_file.write(item.blob)

                notify_queue.put({
                    'type': 'each_finished',
                    'sequence': item.number,
                    'file_name': output_file,
                })
        notify_queue.put({ 'type': 'finish' })



