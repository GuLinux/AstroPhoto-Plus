from functools import wraps
import os
from models import Server
from server_sent_events import SSE
from app import app
import time


class EventListener:
    def __init__(self, controller):
        self.controller = controller

    def on_indiserver_disconnected(self, error_code):
        self.controller.notification('indi_server', 'indi_server_disconnect_error', self.indi_server.to_map(), True, error_code=error_code)

    def on_indi_message(self, device, message):
        self.controller.sse.publish({'event': 'indi_message', 'payload': {'device': device, 'message': message}, 'is_error': False}, type='indi_server')

    def on_indi_property_updated(self, property):
        self.controller.sse.publish({'event': 'indi_property_updated', 'payload': property, 'is_error': False}, type='indi_server')

    def on_indi_property_added(self, property):
        self.controller.sse.publish({'event': 'indi_property_added', 'payload': property, 'is_error': False}, type='indi_server')

    def on_indi_property_removed(self, property):
        self.controller.sse.publish({'event': 'indi_property_removed', 'payload': property, 'is_error': False}, type='indi_server')

    def on_device_added(self, device):
        self.controller.sse.publish({'event': 'indi_device_added', 'payload': device.name, 'is_error': False}, type='indi_server')

    def on_device_removed(self, device):
        self.controller.sse.publish({'event': 'indi_revice_removed', 'payload': device, 'is_error': False}, type='indi_server')

class Controller:
    def __init__(self):
        self.sse = SSE(app.logger)
        self.event_listener = EventListener(self)
        self.indi_server = Server(app.logger, self.event_listener, os.environ.get('INDI_SERVER_HOST', 'localhost'))
        self.sessions = []

    def notification(self, event_type, event_name, payload, is_error, error_code=None, error_message=None):
        self.sse.publish({'event': event_name, 'payload': payload, 'is_error': is_error}, type=event_type)
      

controller = Controller()


