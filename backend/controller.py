from functools import wraps
import os
from models import Server, Device, Property, SavedList, INDIService, Sequence, INDIProfile, settings
from server_sent_events import SSE
from app import app
import time
from sequences_runner import SequencesRunner
import threading



class EventListener:
    def __init__(self, sse):
        self.sse = sse

    def on_indiserver_disconnected(self, error_code):
        self.controller.notification('indi_server', 'indi_server_disconnect_error', self.indi_server.to_map(), True, error_code=error_code)

    def on_indi_message(self, device, message):
        self.sse.publish({'event': 'indi_message', 'payload': {'device': device.to_map(), 'message': message}, 'is_error': False}, type='indi_server')

    def on_indi_property_updated(self, property):
        self.sse.publish({'event': 'indi_property_updated', 'payload': property.to_map(), 'is_error': False}, type='indi_server')

    def on_indi_property_added(self, property):
        self.sse.publish({'event': 'indi_property_added', 'payload': property.to_map(), 'is_error': False}, type='indi_server')

    def on_indi_property_removed(self, property):
        self.sse.publish({'event': 'indi_property_removed', 'payload': property.to_map(), 'is_error': False}, type='indi_server')

    def on_device_added(self, device):
        self.sse.publish({'event': 'indi_device_added', 'payload': device.to_map(), 'is_error': False}, type='indi_server')

    def on_device_removed(self, device):
        self.sse.publish({'event': 'indi_revice_removed', 'payload': device.to_map(), 'is_error': False}, type='indi_server')

    def on_sequence_update(self, sequence):
        self.sse.publish({'event': 'sequence_updated', 'payload': sequence.to_map(), 'is_error': False}, type='sequences')

    def on_sequence_error(self, sequence, message):
        self.sse.publish({'event': 'sequence_error', 'payload': {'sequence': sequence.to_map(), 'error_message': message}, 'is_error': True}, type='sequences')

    def on_indi_service_started(self, devices, service):
        self.sse.publish({'event': 'started', 'payload': { 'devices': devices, 'status': service.status() }, 'is_error': False}, type='indi_service')

    def on_indi_service_reloaded(self):
        self.sse.publish({'event': 'reloaded', 'payload': {}, 'is_error': False}, type='indi_service')

    def on_indi_server_reloaded(self):
        self.sse.publish({'event': 'reloaded', 'payload': {}, 'is_error': False}, type='indi_server')

    def on_sequence_image_saved(self, sequence_item_id, image_id, number, filename):
        self.sse.publish({'event': 'image_saved', 'payload': { 'sequence_item': sequence_item_id, 'image_id': image_id, 'number': number, 'filename': filename }, 'is_error': False}, type='sequences')


    def on_indi_service_exit(self, service):
        service_stdout, service_stderr = None, None
        with open(service.stdout_path, 'r') as f:
            service_stdout = f.read()
        with open(service.stderr_path, 'r') as f:
            service_stderr = f.read()

        self.sse.publish({'event': 'exited', 'payload': { 'exit_code': service.exit_code(), 'stdout': service_stdout, 'stderr': service_stderr }, 'is_error': service.is_error()}, type='indi_service')


class Controller:
    def __init__(self):
        self.sse = SSE(app.logger)
        self.settings = settings
        settings.on_update = self.__on_settings_update
        self.indi_profiles = SavedList(self.settings.indi_profiles_list, INDIProfile)
        self.event_listener = EventListener(self.sse)
        self.sequences_runner = SequencesRunner(app.logger, self)
        self.sequences = None
        self.ping_thread = threading.Thread(target=self.__ping_clients)
        self.ping_thread.start()
        self.__create_indi_service()
        self.__create_indi_server()
        self.sequences = SavedList(self.settings.sequences_list, Sequence)

    def notification(self, event_type, event_name, payload, is_error, error_code=None, error_message=None):
        self.sse.publish({'event': event_name, 'payload': payload, 'is_error': is_error}, type=event_type)


    def __on_settings_update(self, value_name, old_value, new_value):
        app.logger.debug('setting [{}] updated: {} => {}'.format(value_name, old_value, new_value))
        if value_name == 'indi_prefix':
            app.logger.debug('restarting INDI service')
            self.__create_indi_service()
        elif value_name == 'indi_host' or value_name == 'indi_port':
            self.__create_indi_server()
        elif value_name == 'indi_service':
            self.__create_indi_server()


    def __create_indi_server(self):
        self.__disconnect_indi_server()
        self.indi_server = Server(app.logger, self.settings, self.event_listener )
        self.event_listener.on_indi_server_reloaded()
            
    def __create_indi_service(self):
        self.__disconnect_indi_server()
        self.indi_service = INDIService(self.settings, on_started=self.event_listener.on_indi_service_started, on_exit=self.event_listener.on_indi_service_exit)
        self.event_listener.on_indi_service_reloaded()

    def __disconnect_indi_server(self):
        try:
            self.indi_service.stop()
        except:
            pass

    def __ping_clients(self):
        while True:
            time.sleep(5)
            app.logger.debug('pinging clients on SSE interface')
            self.sse.publish({'event': 'ping'}, type='main')



controller = Controller()
event_listener = controller.event_listener
