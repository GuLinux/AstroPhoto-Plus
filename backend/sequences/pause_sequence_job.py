from app import logger
import time
from .stop_sequence import StopSequence


class PauseSequenceJob:
    def __init__(self, data):
        self.id = data['id']
        self.autoresume = data.get('autoresume', 0)
        self.show_notification = data.get('showNotification', False)
        self.notification_message = data.get('notificationMessage')

       
    def to_map(self):
        return {
            'autoresume': self.autoresume,
            'showNotification': self.show_notification,
            'notificationMessage': self.notification_message,
        }

    def run(self, server, devices, root_path, event_listener, on_update, index):
        if self.show_notification:
            event_listener.on_sequence_paused(self.id, self.notification_message, self.autoresume)
        if self.autoresume:
            time.sleep(self.autoresume)
        else:
            raise StopSequence('stopping sequence by sequence job')

    def stop(self):
        return 'finished'

    def reset(self, remove_files=False):
        pass

