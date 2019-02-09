from functools import wraps
import os
from indi import Server, Device, Property, INDIService, INDIProfile, AstrometryIndexDownloader
from models import SavedList
from .settings import settings
from .server_sent_events import SSE
from app import app
import time
from sequences import SequencesRunner, Sequence
from utils.threads import start_thread


class EventListener:
    def __init__(self, sse):
        self.sse = sse

    def on_indiserver_disconnected(self, error_code):
        controller.notification('indi_server', 'indi_server_disconnect_error', controller.indi_server.to_map(), True, error_code=error_code)

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

    def on_indi_service_started(self, drivers, service):
        self.sse.publish({'event': 'started', 'payload': { 'drivers': drivers, 'status': service.status() }, 'is_error': False}, type='indi_service')

    def on_indi_service_reloaded(self):
        self.sse.publish({'event': 'reloaded', 'payload': {}, 'is_error': False}, type='indi_service')

    def on_indi_server_reloaded(self):
        self.sse.publish({'event': 'reloaded', 'payload': {}, 'is_error': False}, type='indi_server')

    def on_sequence_image_saved(self, sequence_job_id, image_id, number, filename):
        self.sse.publish({'event': 'image_saved', 'payload': { 'sequence_job': sequence_job_id, 'image_id': image_id, 'number': number, 'filename': filename }, 'is_error': False}, type='sequences')
    
    def on_sequence_paused(self, sequence_job_id, notification_message, timeout):
        self.sse.publish({'event': 'sequence_paused', 'payload': { 'sequence_job': sequence_job_id, 'notification_message': notification_message, 'notification_timeout': timeout}}, type='sequences')
    
    def on_astrometry_index_downloader(self, event_type, payload=None):
        self.sse.publish({'event': event_type, 'payload': payload}, type='astrometry_index_downloader')


    def on_indi_service_exit(self, service):
        service_stdout, service_stderr = None, None
        with open(service.stdout_path, 'r') as f:
            service_stdout = f.read()
        with open(service.stderr_path, 'r') as f:
            service_stderr = f.read()

        app.logger.debug('INDI service exited with exit code {}'.format(service.exit_code()))
        app.logger.debug('stdout: {}'.format(service_stdout))
        app.logger.debug('stderr: {}'.format(service_stderr))

        self.sse.publish({'event': 'exited', 'payload': { 'exit_code': service.exit_code(), 'stdout': service_stdout, 'stderr': service_stderr }, 'is_error': service.is_error()}, type='indi_service')


class Controller:
    def __init__(self):
        self.sse = SSE(app.logger)
        self.settings = settings
        settings.on_update = self.__on_settings_update
        self.indi_profiles = SavedList(INDIProfile)
        self.event_listener = EventListener(self.sse)
        self.sequences_runner = SequencesRunner(app.logger, self)
        self.sequences = None
        self.ping_thread = start_thread(self.__ping_clients)
        self.__create_indi_service()
        self.__create_indi_server()
        self.sequences = SavedList(Sequence)
        self.astrometry_downloader = AstrometryIndexDownloader(self.event_listener)

    def notification(self, event_type, event_name, payload, is_error, error_code=None, error_message=None):
        self.sse.publish({'event': event_name, 'payload': payload, 'is_error': is_error}, type=event_type)


    def __on_settings_update(self, value_name, old_value, new_value):
        app.logger.info('setting [{}] updated: {} => {}'.format(value_name, old_value, new_value))
        if value_name == 'indi_prefix':
            app.logger.info('restarting INDI service')
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
            self.sse.publish({'event': 'ping'}, type='main')



controller = Controller()
event_listener = controller.event_listener
