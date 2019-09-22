import socket
import select
import threading
import time
from app import logger
from errors import FailedMethodError, BadRequestError
from utils.threads import start_thread, thread_queue
from queue import Empty
import json

class PHD2Socket:
    def __init__(self):
        self.__connect = False
        self.__thread = None
        self.recv_queue, self.out_queue = thread_queue(), thread_queue()
        self.connected = False
        self.__id = 0

    def connect(self, hostname='localhost', port=4400):
        self.__connect = True
        self.__thread = start_thread(self.__connect_socket, hostname, port)
        result = self.recv_queue.get()
        result.update({
            'error': str(result.get('error')),
            'host': hostname,
            'port': port,
        })
        return result


    def disconnect(self):
        if not self.__thread:
            return BadRequestError('PHD2 Not connected')
        self.__connect = False
        self.__thread.join()

    def __send_method(self, method_name, parameters=[]):
        id = self.__id
        self.__id += 1
        self.out_queue.put({
            'method': method_name,
            'params': parameters,
            'id': id,
        })
        return { 'success': self.recv_queue.get().get('result', 1) == 0 }

    def __connect_socket(self, address, port):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as connection:
                try:
                    connection.connect((address, port))
                    self.recv_queue.put({ 'connected': True })
                    self.connected = True
                except Exception as e:
                    self.recv_queue.put({ 'connected': False, 'error': e })
                    return 
                inout = [connection]
                fileobj = connection.makefile()
                while self.__connect:
                    infds, outfds, errfds = select.select(inout, inout, [], 0)
                    if infds:
                        self.__handle_message(fileobj.readline())
                    if outfds:
                        try:
                            message = self.out_queue.get_nowait()
                            connection.send('{}\r\n'.format(json.dumps(message)).encode() )
                        except Empty:
                            pass
        finally:
            self.connected = False

    def __handle_message(self, message):
        if not message:
            # if we're here it's usually because we've been disconnected. TODO: improve checks
            self.__connect = False
            return
        data = json.loads(message)
        if data.get('jsonrpc'):
            self.recv_queue.put(data)
        elif data.get('Event'):
            self.__handle_event(data)
        else:
            logger.warning('Received unknown message: {}'.format(message))

    def __handle_event(self, event):
        logger.debug('event: {}'.format(event))



