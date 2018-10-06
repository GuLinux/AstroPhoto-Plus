import os
from argparse import Namespace
import json
import shutil
from utils.threads import start_thread
from utils.mp import mp_queue, mp_start_process

from app import logger

class SaveFITSError(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)


class SaveAsyncFITS:
    MAX_QUEUE_SIZE=2

    def __init__(self, on_saved, on_error):
        self.files_queue = mp_queue(SaveAsyncFITS.MAX_QUEUE_SIZE)
        self.notify_queue = mp_queue()

        self.process_files = mp_start_process(self.__process_sequence_files, self.files_queue, self.notify_queue)
        self.notify_thread = start_thread(self.__notify_sequence_finished, self.notify_queue)

        self.on_saved = on_saved
        self.on_error = on_error

    def join(self):
        self.process_files.join()
        self.notify_thread.join()

    def put(self, shot):
        self.files_queue.put({ 'type': 'shot', 'shot': shot})

    def finished(self):
        self.files_queue.put({ 'type': 'finish' })
        self.join()

    def stopped(self):
        self.files_queue.put({ 'type': 'stopped' })
        self.join()

 
    def __notify_sequence_finished(self, notify_queue):
        while True:
            item = Namespace(**notify_queue.get())
            if item.type == 'finish':
                return
            elif item.type == 'stopped':
                return
            elif item.type == 'each_finished':
                self.on_saved(item.shot)
            elif item.type == 'exception':
                self.on_error(item.error, item.number)

    def __process_sequence_files(self, input_queue, notify_queue):
        item_number = None
        while True:
            item = Namespace(**input_queue.get())
            try:
                if item.type == 'finish':
                    notify_queue.put({ 'type': 'finish' })
                    return
                elif item.type == 'stopped':
                    notify_queue.put({'type': 'stopped'})
                    return
                elif item.type == 'shot':
                    item_number = item.shot.number
                    item.shot.save() 
                    notify_queue.put({
                        'type': 'each_finished',
                        'shot': shot,
                    })
            except Exception as e:
                logger.warning('Error saving fits', e)
                notify_queue.put({ 'type': 'exception', 'error': str(e), 'number': item_number })
                return

