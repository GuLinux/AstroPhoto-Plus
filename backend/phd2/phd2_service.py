import queue
from app import logger
from utils.threads import start_thread
from utils.worker import Worker
import time
from .phd2_socket import PHD2Socket 
from .phd2_process import PHD2Process
from .errors import PHD2ConnectionError
from system import sse

PHD2_RECONNECTION_PAUSE = 5


@Worker(model='threading')
class PHD2Service:
    def __init__(self):
        self.__socket = PHD2Socket()
        self.__phd2_process = PHD2Process()
        self.__state = { 'running': False, 'connected': False }
        self.__last_connection_attempt = 0

    def on_run(self):
        self.__check_connection()
        self.__check_phd2_process_status()
        time.sleep(0.0001)

    def phd2_method(self, method_name, *args):
        return self.__socket.send_method(method_name, *args)

    def get_state(self):
        return self.state

    @property
    def state(self):
        state = self.__state
        state.update({ 'process': self.__phd2_process.running})
        return state

    def dither(self, pixels, ra_only, settle_object, wait_for_settle=True):
        self.__change_state(None, key='settle')
        self.phd2_method('dither', pixels, ra_only, settle_object)
        if wait_for_settle:
            while not self.state.get('settle'):
                pass # should be handled better. We need some time for phd2 to actually start settling
            while self.state['settle']['settling']:
                pass
            if self.state['settle']['error']:
                raise PHD2MethodError('dither', 'Dithering settling failed: {}'.format(self.state['settling']['error_message']), self.state['settling']['error_code'])
        return {'success': True}

    def set_profile(self, profile_id):
        self.phd2_method('set_profile', profile_id)

    def start_framing(self):
        self.phd2_method('set_connected', True)
        self.phd2_method('loop')

    def start_guiding(self, settle, recalibrate):
        self.phd2_method('guide', settle, recalibrate)

    def stop_capture(self):
        self.phd2_method('stop_capture')


    def get_phd2_state(self, publish=True):
        state_reply = self.phd2_method('get_app_state')
        #logger.debug('get_phd2_: state reply: {}'.format(state_reply))
        if 'result' in state_reply:
            self.__change_state(state_reply['result'], publish=publish)
        return state_reply

    def start_phd2(self, phd2_path, display):
        return self.__phd2_process.start(phd2_path, display)

    def stop_phd2(self):
        return self.__phd2_process.stop()

    def get_profiles(self):
        profiles = self.phd2_method('get_profiles')['result']
        equipment_connected = self.phd2_method('get_connected')['result']
        logger.debug('PHD2 Profiles: {}, equipment_connected: {}'.format(profiles, equipment_connected))
        self.__change_state(equipment_connected, key='equipment_connected', publish=False)
        self.__change_state(profiles, key='profiles', publish=True, publish_event='profiles')

    @property
    def connected(self):
        return self.state.get('connected', False)

    def on_start(self):
        logger.debug('PHD2 Service started')
        self.__change_state(True, key='running', publish=False)
        self.__events_thread = start_thread(self.__check_events)

    def on_stopped(self):
        logger.debug('PHD2 Service stopped')
        self.__change_state(False, key='running', publish=False)
        self.__events_thread.join()
        self.__events_thread = None

    def __check_connection(self):
        now = time.time()
        if self.connected or now - self.__last_connection_attempt < PHD2_RECONNECTION_PAUSE:
            return
        try:
            self.__last_connection_attempt = now
            connection_successful = self.__socket.connect()
            self.__change_state(None, key='connection_error', publish=False)
            self.__change_state(connection_successful, key='connected', publish_event='connected')
            logger.debug('PHD2 Connected')
            self.get_phd2_state()
            self.get_profiles()
        except PHD2ConnectionError as e:
            # logger.debug('PHD2 connection failed, sleeping for %d seconds: %s', PHD2_RECONNECTION_PAUSE, e.message)
            self.__disconnected(e.message)

    def __disconnected(self, message=None):
        self.__state = { 'running': self.state['running'], 'connected': False, 'process': self.state['process'], 'connection_error': message }
        self.__publish_state_event(name='disconnected')


    def __publish_event(self, name, payload=None):
        sse.publish_event('phd2', name, payload)

    def __publish_state_event(self, name='phd2_state'):
        self.__publish_event(name, payload=self.state)

    def __change_state(self, value, publish=True, key='phd2_state', publish_event='phd2_state'):
        self.__state[key] = value
        if publish:
            self.__publish_state_event(name=publish_event)

    def __check_events(self):
        try:
            while self.state['running']:
                try:
                    event = self.__socket.events_queue.get_nowait()
                    if event['type'] == 'disconnected':
                        logger.debug('PHD2 disconnected')
                        self.__disconnected()
                    elif event['type'] == 'phd2_event':
                        self.__on_phd2_socket_event(event['event'])
                    else:
                        logger.debug('PHD2Service: Unknown event: {}'.format(event))
                except queue.Empty:
                    pass
                time.sleep(0.0001)
        except Exception as e:
            logger.warning('PHD2 Service: an error occured processing events', exc_info=e)
        finally:
            logger.debug('PHD2 Service: Stopped checking events')


    def __check_phd2_process_status(self):
        phd2_process_running = self.__phd2_process.running
        self.__change_state(phd2_process_running, key='process', publish=self.state['process'] != phd2_process_running, publish_event='process')

    def __on_phd2_socket_event(self, event):
        try:
            #logger.debug('Received event {}, querying status'.format(event))
            self.get_phd2_state(publish=False)
            #logger.debug('received status: {}'.format(self.state))
        except PHD2ConnectionError:
            #logger.debug('PHD2ConnectionError while waiting for state')
            self.__disconnected()
            return

        event_type = event['Event']
        if event_type == 'Version':
            self.__change_state(event['PHDVersion'], key='version')

        if event_type == 'AppState':
            self.__change_state(event['State'])

        if event_type == 'ConfigurationChange':
            logger.debug('ConfigurationChange event: {}, querying profiles'.format(event))
            self.get_profiles()

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
            self.__publish_state_event('guiding_started')

        if event_type == 'GuideStep':
            self.__publish_event('guide_step', { 'state': self.state, 'guide_step': event})

        if event_type == 'StarLost':
            self.__publish_state_event('star_lost')

        if event_type == 'GuidingStopped':
            self.__publish_state_event('guiding_stopped')

        if event_type == 'LoopingExposuresStopped':
            self.__publish_state_event()

        if event_type == 'LockPositionLost':
            self.__publish_state_event()

        if event_type == 'GuidingDithered':
            self.__publish_event('dithering', { 'state': self.state, 'dithering': event})

        if event_type == 'SettleBegin':
            self.__change_state({'settling': True}, key='settle', publish=False)
            self.__publish_state_event('settle_begin')

        if event_type == 'Settling':
            self.__publish_event('settling', { 'state': self.state, 'settling': event})

        if event_type == 'SettleDone':
            self.__change_state({
                'error': event['Status'] != 0,
                'error_code': event['Status'],
                'error_message': event.get('Error'),
                'settling': False,
            }, key='settle', publish=False)
            logger.debug('SettleDone: {}'.format(self.state))
            self.__publish_event('settle_done', { 'state': self.state, 'settle_done': event})


