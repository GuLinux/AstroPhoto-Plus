import socket
import select
import threading
import time
from app import logger
from errors import FailedMethodError, BadRequestError
from utils.threads import start_thread, thread_queue
from queue import Empty
import json

class PHDConnectionError(Exception):
    def __init__(self, message, parent=None):
        self.message = message
        self.parent = parent


class PHD2Socket:
    def __init__(self):
        self.__connect = False
        self.__thread = None
        self.recv_queue, self.methods_queue, self.events_queue = thread_queue(), thread_queue(), thread_queue()
        self.__id = 0

    def connect(self, hostname='localhost', port=4400):
        self.__connect = True
        self.__thread = start_thread(self.__socket_loop, hostname, port)
        return self.__get_result()

    def disconnect(self):
        if not self.__thread:
            return BadRequestError('PHD2 Not connected')
        self.__connect = False
        self.__thread.join()

    def send_method(self, method_name, parameters=[]):
        id = self.__id
        self.__id += 1
        self.methods_queue.put({
            'method': method_name,
            'params': parameters,
            'id': id,
        })
        return { 'success': self.recv_queue.get().get('result', 1) == 0 }

    def __socket_loop(self, address, port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as connection:
            try:
                connection.connect((address, port))
                self.__put_result(True)
            except Exception as e:
                self.__put_error(PHDConnectionError(str(e), e))
                return 
            inout = [connection]
            fileobj = connection.makefile()
            try:
                while self.__connect:
                    infds, outfds, errfds = select.select(inout, inout, [], 0)
                    if infds:
                        self.__handle_message(fileobj.readline())
                    if outfds:
                        try:
                            message = self.methods_queue.get_nowait()
                            connection.send('{}\r\n'.format(json.dumps(message)).encode() )
                        except Empty:
                            pass
            finally:
                self.__put_event('disconnected')

    def get_event(self):
        try:
            return self.events_queue.get_nowait()
        except queue.Empty():
            return None

    def __put_result(self, payload):
        self.recv_queue.put((payload, False))

    def __put_event(self, event_type, payload=None):
        self.events_queue.put({'type': event_type, 'payload': payload})

    def __put_error(self, payload):
        self.recv_queue.put((payload, True))


    def __get_result(self, timeout=10):
        result, is_exception = self.recv_queue.get(timeout)
        if is_exception:
            raise result
        return result


    def __handle_message(self, message):
        if not message:
            # if we're here it's usually because we've been disconnected. TODO: improve checks
            self.__connect = False
            return
        data = json.loads(message)
        if data.get('jsonrpc'):
            self.__put_result(data)
        elif data.get('Event'):
            self.__handle_event(data)
        else:
            logger.warning('Received unknown message: {}'.format(message))

    def __handle_event(self, event):
        self.events_queue.put({ 'type': 'phd2_event', 'event': event})



