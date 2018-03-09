from pyindi_sequence import INDIClient
from .camera import Camera
from .device import Device

class Server:
    DEFAULT_PORT = INDIClient.DEFAULT_PORT

    def __init__(self, host, port=INDIClient.DEFAULT_PORT):
        self.host = host
        self.port = port
        self.client = None

    def to_map(self):
        return {'host': self.host, 'port': self.port, 'connected': self.is_connected() }

    def connect(self):
        self.client = INDIClient()

    def disconnect(self):
        if self.client:
            self.client.disconnectServer()
        self.client = None

    def is_connected(self):
        return self.client.isServerConnected() if self.client else False

    def devices(self):
        return [Device(d) for d in self.client.devices()]

    def cameras(self):
        return [Camera(c) for c in self.client.cameras()]

