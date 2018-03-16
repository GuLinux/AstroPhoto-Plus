from functools import wraps
import os
from models import Server
from server_sent_events import SSE
from app import app


class Controller:
    def __init__(self):
        self.indi_server = Server(app.logger, os.environ.get('INDI_SERVER_HOST', 'localhost'), on_disconnect=self.__on_indiserver_disconnected)
        self.sessions = []
        self.sse = SSE(app.logger)

    def notification(self, event_type, event_name, payload, is_error, error_code=None, error_message=None):
        self.sse.publish({'event': event_name, 'payload': payload, 'is_error': is_error}, type=event_type)

    def __on_indiserver_disconnected(self, error_code):
        self.notification('indi_server', 'indi_server_disconnect_error', self.indi_server.to_map(), True, error_code=error_code)
        

controller = Controller()


