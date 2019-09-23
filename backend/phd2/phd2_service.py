import queue
from app import logger
import time
import commands
from .phd2_socket import PHD2Socket, PHDConnectionError


class PHD2Service:
    def __init__(self, input_queue, output_queue, events_queue):
        self.input_queue = input_queue
        self.output_queue = output_queue
        self.events_queue = events_queue
        self.__running = True
        self.__socket = PHD2Socket()
        self.state = { 'running': self.__running, 'connected': False }

    def run(self):
        logger.debug('Running PHD2 service')
        while self.__running:
            self.__check_connection()
            self.__dequeue_command()
            self.__check_events()
            time.sleep(0.01)

    def stop(self):
        self.__running = False

    def reply(self, response):
        self.output_queue.put(response)

    @property
    def connected(self):
        return self.state.get('connected', False)

    def __check_connection(self):
        if self.connected:
            return
        try:
            self.state['connected'] = self.__socket.connect()
            self.__publish_event('phd2_connected', self.state)
            logger.debug('PHD2 Connected')
        except PHDConnectionError as e:
            logger.debug('PHD2 connection failed', exc_info=e)
            self.__publish_event('phd2_disconnected', e.message)
            time.sleep(5)

    def __publish_event(self, name, payload=None):
            self.events_queue.put({ 'name': name, 'payload': payload})

    def __dequeue_command(self):
        try:
            self.input_queue.get_nowait()(process=self)
        except queue.Empty:
            pass

    def __check_events(self):
        try:
            event = self.__socket.events_queue.get_nowait()
            if event['type'] == 'disconnected':
                logger.debug('PHD2 disconnected')
                self.state['connected'] = False
                self.__publish_event('phd2_disconnected')
            else:
                logger.debug('Unknown PHD2 event: {}'.format(event))

        except queue.Empty:
            pass



