from pyindi_sequence import INDIClient
from .camera import Camera
from .telescope import Telescope
from .guider import Guider
from .filter_wheel import FilterWheel
from .device import Device
from .indi_property import Property
import time
from errors import NotFoundError
from .blob_client import BLOBClient
import threading

class INDIEventListener:
    def __init__(self, server):
        self.server = server
        self.listeners = []

    def add(self, name, listener):
        self.listeners.append({ 'name': name, 'listener': listener })

    def remove(self, name):
        self.listeners = [l for l in self.listeners if l['name'] != name]

    def on_indi_message(self, device, message):
        self.__callback('on_indi_message', device, message)

    def on_indiserver_disconnected(self, error_code):
        self.__callback('on_indiserver_disconnected', self.server, error_code)

    def on_indi_property_updated(self, property):
        self.__callback('on_indi_property_updated', property)

    def on_indi_property_added(self, property):
        self.__callback('on_indi_property_added', property)

    def on_indi_property_removed(self, property):
        self.__callback('on_indi_property_removed', property)

    def on_device_added(self, device):
        self.__callback('on_device_added', device)

    def on_device_removed(self, device):
        self.__callback('on_device_removed', device)

    def __callback(self, callback_name, *args, **kwargs):
        for l in self.listeners:
            listener = l['listener']
            if hasattr(listener, callback_name):
                getattr(listener, callback_name)(*args, **kwargs)

class Server:
    DEFAULT_PORT = INDIClient.DEFAULT_PORT

    def __init__(self, logger, settings):
        self.logger = logger
        self.settings = settings
        self.client = None
        self.__disconnect_requested = 0
        self.event_listener = INDIEventListener(self)
        self.blob_client = BLOBClient()

    def to_map(self):
        return {'host': self.settings.indi_host, 'port': self.settings.indi_port, 'connected': self.is_connected() }

    def connect(self):
        if self.is_connected():
            return
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

    def get_camera(self, id):
        camera = [c for c in self.cameras() if c.id == id]
        if not camera:
            raise NotFoundError('Camera {} not found'.format(id))
        return camera[0]

    def telescopes(self):
        return [Telescope(self.settings, self.client, device=d) for d in self.client.telescopes()]

    def get_telescope(self, id):
        telescope = [t for t in self.telescopes() if t.id == id]
        if not telescope:
            raise NotFoundError('Telescope {} not found'.format(id))
        return telescope[0]

    def guiders(self):
        return [Guider(self.settings, self.client, device=d) for d in self.client.guiders()]

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
        try:
            self.event_listener.on_indi_property_added(self.property(device=device, group=group, name=property_name))
        except RuntimeError as e:
            self.logger.warning('Error on property added: {}'.format(e))
        
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
        self.event_listener.on_device_removed(self.device(name=device))

