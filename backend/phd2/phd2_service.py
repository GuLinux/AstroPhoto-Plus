import queue
from app import logger
import time
import commands
from .phd2_socket import PHD2Socket

CONNECTION_RETRY_SECONDS = 10


class PHD2Service:
    def __init__(self, input_queue, output_queue, events_queue):
        self.input_queue = input_queue
        self.output_queue = output_queue
        self.events_queue = events_queue
        self.__running = True
        self.__socket = PHD2Socket()
        self.__last_connection_attempt = 0
        self.state = { 'running': self.__running, 'connected': False }

    def run(self):
        logger.debug('Running PHD2 service')
        while self.__running:
            self.__check_connection()
            self.__dequeue_command()
            time.sleep(0.01)

    def stop(self):
        self.__running = False

    def reply(self, response):
        self.output_queue.put(response)


    def __check_connection(self):
        if self.__socket.connected:
            return
        if self.state['connected']:
            self.state['connected'] = False
            self.__publish_event('phd2_disconnected', self.state)

        now = time.time()
        if now - self.__last_connection_attempt < CONNECTION_RETRY_SECONDS:
            return
        connection_result = self.__socket.connect()
        logger.debug('PHD2 connection check: {}'.format(connection_result))
        self.state['connected'] = connection_result['connected']

        if not self.state['connected']:
            self.__last_connection_attempt = now
        else:
            self.__publish_event('phd2_connected', self.state)

    def __publish_event(self, name, payload):
            self.events_queue.put({ 'name': name, 'payload': payload})


    def __dequeue_command(self):
        try:
            self.input_queue.get_nowait()(process=self)
        except queue.Empty:
            pass



