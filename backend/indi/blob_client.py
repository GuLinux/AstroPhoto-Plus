import queue
import multiprocessing
import shutil
import os
from pyindi_sequence import INDIClient
from contextlib import contextmanager
from app import logger

class BLOBError(Exception):
    def __init(self, message):
        super().__init__(message)



class BLOB:
    def __init__(self, bp):
        self.name = bp.name
        self.label = bp.label
        self.format = bp.format
        self.blob_len = bp.bloblen
        self.size = bp.size
        self.data = bp.getblobdata()

    def save(self, filename):
        with open(filename, 'wb') as file:
            file.write(self.data)


class BLOBListener:
    def __init__(self, device, queue_size):
        self.device = device
        self.queue = multiprocessing.Queue(queue_size)

    def get(self, timeout=30):
        try:
            logger.debug('BLOBListener[{}]: waiting for blob, timeout={}'.format(self.device.name, timeout))
            blob = self.queue.get(True, timeout)
            logger.debug('BLOBListener[{}]: blob received, name={}, label={}, size={}'.format(self.device.name, blob.name, blob.label, blob.size))
            return blob
        except queue.Empty:
            raise BLOBError('Timeout while waiting for BLOB on {}'.format(self.device.name))


class BLOBClient:
    def __init__(self, queue_size=5):
        self.indi_client = None
        self.__listeners = []
        self.queue_size = queue_size

    def connect(self, indi_host, indi_port):
        self.indi_client = INDIClient(address=indi_host, port=indi_port, callbacks={
            'on_new_blob': self.__on_new_blob,
        }, autoconnect=False)
        def on_new_property(device, group, property_name):
            self.indi_client.setBLOBMode(1, device, None)

        self.indi_client.callbacks['on_new_property'] = on_new_property 
        self.indi_client.connectServer()
        logger.debug('BLOBClient connected')

    def disconnect(self, address, port):
        if self.indi_client:
            self.indi_client.disconnectServer()
        self.indi_client = None
        logger.debug('BLOBClient disconnected')

    @contextmanager
    def listener(self, device):
        listener = BLOBListener(device, self.queue_size)
        self.__listeners.append(listener)
        yield(listener)
        self.__listeners = [x for x in self.__listeners if x is not listener]

    def __on_new_blob(self, bp):
        for listener in self.__listeners:
            if bp.bvp.device == listener.device.name:
                listener.queue.put(BLOB(bp))

    
