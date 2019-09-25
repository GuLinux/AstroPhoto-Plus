import queue
from app import logger
import time
from . import commands
from .phd2_socket import PHD2Socket, PHDConnectionError

PHD2_RECONNECTION_PAUSE = 5


class PHD2Service:
    def __init__(self, input_queue, output_queue, events_queue):
        self.input_queue = input_queue
        self.output_queue = output_queue
        self.events_queue = events_queue
        self.__running = True
        self.__socket = PHD2Socket()
        self.state = { 'running': self.__running, 'connected': False }
        self.__last_connection_attempt = 0

    def run(self):
        logger.debug('Running PHD2 service')
        while self.__running:
            self.__check_connection()
            self.__dequeue_command()
            self.__check_events()
            time.sleep(0.001)

    def stop(self):
        self.__running = False

    def reply(self, response):
        self.output_queue.put(response)

    def phd2_method(self, method_name, *args):
        return self.__socket.send_method(method_name, *args)

    @property
    def connected(self):
        return self.state.get('connected', False)

    def __check_connection(self):
        now = time.time()
        if self.connected or now - self.__last_connection_attempt < PHD2_RECONNECTION_PAUSE:
            return
        try:
            self.__last_connection_attempt = now
            self.state['connected'] = self.__socket.connect()
            self.__publish_state_event('connected')
            logger.debug('PHD2 Connected')
            commands.GetPHD2State()(self)
            self.__publish_state_event()
        except PHDConnectionError as e:
            logger.debug('PHD2 connection failed, sleeping for %d seconds: %s', PHD2_RECONNECTION_PAUSE, e.message)
            self.__disconnected(e.message)

    def __disconnected(self, message=None):
        self.state = { 'running': self.__running, 'connected': False }
        self.__publish_event('disconnected', message)


    def __publish_event(self, name, payload=None):
        self.events_queue.put({ 'name': name, 'payload': payload})

    def __publish_state_event(self, name='phd2_state'):
        self.__publish_event(name, payload=self.state)

    def __dequeue_command(self):
        try:
            command = self.input_queue.get_nowait()
            command(process=self)
        except queue.Empty:
            pass

    def __check_events(self):
        try:
            event = self.__socket.events_queue.get_nowait()
            if event['type'] == 'disconnected':
                logger.debug('PHD2 disconnected')
                self.__disconnected()
            if event['type'] == 'phd2_event':
                self.__phd2_event(event['event'])
            else:
                logger.debug('PHD2Service: Unknown event: {}'.format(event))

        except queue.Empty:
            pass

    def __change_state(self, key, value, publish=True):
        self.state[key] = value
        if publish:
            self.__publish_state_event()

    def __change_phd2_state(self, value, publish=True):
        self.__change_state('phd2_state', value, publish)

    def __phd2_event(self, event):
        commands.GetPHD2State()(self)
        logger.debug('PHD2 event: {}, state={}'.format(event, self.state['phd2_state']))
        event_type = event['Event']
        if event_type == 'Version':
            self.__change_state('version', event['PHDVersion'])

        if event_type == 'AppState':
            self.__change_phd2_state(event['State'])

        if event_type == 'ConfigurationChange':
            self.__publish_state_event()

        if event_type == 'LoopingExposures':
            self.__publish_state_event()

        if event_type == 'LoopingExposuresStopped':
            self.__publish_state_event()

        if event_type == 'StarSelected':
            self.__publish_state_event()

        if event_type == 'Calibrating':
            self.__publish_state_event()

        if event_type == 'CalibrationComplete':
            self.__publish_state_event()

        if event_type == 'LockPositionSet':
            self.__publish_state_event()

        if event_type == 'StartGuiding':
            self.__publish_state_event()

        if event_type == 'GuideStep':
            self.__publish_state_event()

        if event_type == 'StarLost':
            self.__publish_state_event()

        if event_type == 'GuidingStopped':
            self.__publish_state_event()

        if event_type == 'LoopingExposuresStopped':
            self.__publish_state_event()

        if event_type == 'LockPositionLost':
            self.__publish_state_event()

