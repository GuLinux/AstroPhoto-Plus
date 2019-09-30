from functools import wraps
import os
from indi import Server, Device, Property, INDIService, INDIProfile
from platesolving import PlateSolving, AstrometryIndexDownloader
from models import SavedList
from .settings import settings
from .server_sent_events import sse
from .event_listener import event_listener
from app import logger
import time
from sequences import SequencesRunner, Sequence
from utils.threads import start_thread

class Controller:
    def __init__(self):
        self.settings = settings
        settings.add_update_listener(self.__on_settings_update)
        self.indi_profiles = SavedList(INDIProfile)
        self.sequences_runner = SequencesRunner(logger, self)
        self.sequences = None
        self.ping_thread = start_thread(self.__ping_clients)
        self.__create_indi_service()
        self.__create_indi_server()
        self.sequences = SavedList(Sequence)
        self.astrometry_downloader = AstrometryIndexDownloader(event_listener)
        self.platesolving = PlateSolving(self.indi_server, event_listener)

    def notification(self, event_type, event_name, payload, is_error, error_code=None, error_message=None):
        sse.publish({'event': event_name, 'payload': payload, 'is_error': is_error}, type=event_type)


    def __on_settings_update(self, value_name, old_value, new_value):
        logger.info('setting [{}] updated: {} => {}'.format(value_name, old_value, new_value))
        if value_name == 'indi_prefix':
            logger.info('restarting INDI service')
            self.__create_indi_service()
        elif value_name == 'indi_host' or value_name == 'indi_port':
            self.__create_indi_server()
        elif value_name == 'indi_service':
            self.__create_indi_server()

    def __create_indi_server(self):
        self.__disconnect_indi_server()
        self.indi_server = Server(logger, self.settings)
        self.indi_server.event_listener.add('sse', event_listener)
        event_listener.on_indi_server_reloaded()
            
    def __create_indi_service(self):
        self.__disconnect_indi_server()
        self.indi_service = INDIService(self.settings, on_started=event_listener.on_indi_service_started, on_exit=event_listener.on_indi_service_exit)
        event_listener.on_indi_service_reloaded()

    def __disconnect_indi_server(self):
        try:
            self.indi_service.stop()
        except:
            pass

    def __ping_clients(self):
        while True:
            time.sleep(5)
            sse.publish({'event': 'ping'}, type='main')



controller = Controller()
