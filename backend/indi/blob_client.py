import queue
import shutil
import os
from pyindi_sequence import INDIClient
from contextlib import contextmanager
from app import logger
from utils.mp import mp_queue

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
        self.queue = mp_queue(queue_size)

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

    def __on_new_property(self, device, group, property_name):
        self.indi_client.setBLOBMode(1, device, None)

    def connect(self, indi_host, indi_port):
        self.indi_client = INDIClient(address=indi_host, port=indi_port, callbacks={
            'on_new_blob': self.__on_new_blob,
            'on_server_connected': lambda: logger.info('BLOBClient: INDI server connected'),
            'on_server_disconnected': self.__on_disconnected,
            'on_new_property': self.__on_new_property,
        }, autoconnect=False)

        self.indi_client.connectServer()
        logger.debug('BLOBClient connected')

    def disconnect(self):
        if self.indi_client:
            indi_client = self.indi_client
            self.indi_client = None
            indi_client.disconnectServer()
        logger.debug('BLOBClient disconnected')
    
    def __on_disconnected(self, code):
        if self.indi_client:
            logger.warning('BLOBClient: Unexpected disconnection from INDI server with error code {}, trying to connect'.format(code))
            self.connect(self.indi_client.host, self.indi_client.port)

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

    
