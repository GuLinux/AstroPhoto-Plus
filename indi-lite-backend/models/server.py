from pyindi_sequence import INDIClient
from .camera import Camera
from .device import Device
import time

class Server:
    DEFAULT_PORT = INDIClient.DEFAULT_PORT

    def __init__(self, logger, host, port=INDIClient.DEFAULT_PORT, on_disconnect=None):
        self.host = host
        self.port = port
        self.client = None
        self.on_disconnect = on_disconnect
        self.__disconnect_requested = 0
        self.logger = logger

    def to_map(self):
        return {'host': self.host, 'port': self.port, 'connected': self.is_connected() }

    def connect(self):
        self.client = INDIClient(address=self.host, port=self.port)
        self.client.callbacks['on_server_disconnected'] = self.__on_disconnected

    def disconnect(self):
        self.__disconnect_requested = time.time()
        if self.client:
            self.client.disconnectServer()
        self.client = None

    def is_connected(self):
        return self.client.isServerConnected() if self.client else False

    def devices(self):
        return [Device(d) for d in self.client.devices()]

    def cameras(self):
        return [Camera(c) for c in self.client.cameras()]

    def __on_disconnected(self, error_code):
        self.logger.debug('indi server disconnected; disconnect_requested: {}'.format(self.__disconnect_requested))
        if  time.time() - self.__disconnect_requested > 2 and self.on_disconnect:
            self.on_disconnect(error_code)

