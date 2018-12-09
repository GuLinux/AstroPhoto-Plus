from pyindi_sequence import INDIClient
from .camera import Camera
from .telescope import Telescope
from .astrometry import Astrometry
from .filter_wheel import FilterWheel
from .device import Device
from .indi_property import Property
import time
from errors import NotFoundError
from .blob_client import BLOBClient
import threading


class Server:
    DEFAULT_PORT = INDIClient.DEFAULT_PORT

    def __init__(self, logger, settings, event_listener):
        self.logger = logger
        self.settings = settings
        self.client = None
        self.__disconnect_requested = 0
        self.event_listener = event_listener
        self.blob_client = BLOBClient()

    def to_map(self):
        return {'host': self.settings.indi_host, 'port': self.settings.indi_port, 'connected': self.is_connected() }

    def connect(self):
        self.client = INDIClient(address=self.settings.indi_host, port=self.settings.indi_port, callbacks={
            'on_server_disconnected': self.__on_disconnected,
            'on_new_device': self.__on_device_added,
            'on_device_removed': self.__on_device_removed,
            'on_new_property': self.__on_property_added,
            'on_remove_property': self.__on_property_removed,
            'on_new_switch': self.__on_property_updated,
            'on_new_number': self.__on_property_updated,
            'on_new_text': self.__on_property_updated,
            'on_new_light': self.__on_property_updated,
            'on_new_message': self.__on_message,
        })
        self.blob_client.connect(self.settings.indi_host, self.settings.indi_port)

    def disconnect(self):
        self.__disconnect_requested = time.time()
        if self.client:
            self.client.disconnectServer()
        self.client = None
        self.blob_client.disconnect()

    def is_connected(self):
        return self.client.isServerConnected() if self.client else False

    def devices(self):
        return [Device(self.client, self.logger, indi_device=d) for d in self.client.devices()]

    def device(self, *args, **kwargs):
        return Device(self.client, self.logger, *args, **kwargs)

    def property(self, *args, **kwargs):
        return Property(self.client, self.logger, *args, **kwargs)

    def cameras(self):
        return [Camera(self.settings, self.client, self.logger, camera=c) for c in self.client.cameras()]

    def telescopes(self):
        return [Telescope(self.settings, self.client, device=d) for d in self.client.telescopes()]

    def astrometry_drivers(self):
        return [Astrometry(self, device=d.find_indi_device()) for d in self.devices() if 'astrometry' in d.name.lower()]

    def filter_wheels(self):
        return [FilterWheel(self.client, self.logger, filter_wheel=f) for f in self.client.filter_wheels()]

    def __on_message(self, device, message):
        self.event_listener.on_indi_message(self.device(indi_device=device), message)

    def __on_disconnected(self, error_code):
        self.logger.info('indi server disconnected; disconnect_requested: {}'.format(self.__disconnect_requested))
        self.blob_client.disconnect()
        self.client = None
        if  time.time() - self.__disconnect_requested > 2 and self.event_listener.on_indiserver_disconnected:
            self.event_listener.on_indiserver_disconnected(error_code)

    def __on_property_updated(self, vector_property):
        self.event_listener.on_indi_property_updated(self.property(indi_vector_property=vector_property))

    def __on_property_added(self, device, group, property_name):
        self.event_listener.on_indi_property_added(self.property(device=device, group=group, name=property_name))
        
    def __on_property_removed(self, indi_property):
        self.event_listener.on_indi_property_removed(self.property(indi_device_property=indi_property))

    def __on_device_added(self, indi_device):
        def wait_for_interfaces():
            device = None
            started = time.time()
            while time.time() - started < 5:
                device = self.device(name=indi_device.name)
                if device.to_map()['interfaces']:
                    break
                time.sleep(0.1)
            self.event_listener.on_device_added(device)
        threading.Thread(target=wait_for_interfaces).start()

    def __on_device_removed(self, device):
        self.event_listener.on_device_removed(self.device(name=device.name))

