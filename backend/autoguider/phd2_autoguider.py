import socket
import select
import threading
import time
from app import logger
from errors import FailedMethodError, BadRequestError
from queue import Queue, Empty
import json

class PHD2Autoguider:
    def __init__(self, event_listener):
        self.event_listener = event_listener
        self.__connect = False
        self.__thread = None
        self.recv_queue = Queue()
        self.out_queue = Queue()
        self.settle = {'pixels': 1.5, 'time': 8, 'timeout': 40} 
        
    def connect(self, hostname, port):
        if not hostname:
            hostname = 'localhost'
        if not port:
            port = 4400
        self.__connect = True
        self.__thread = threading.Thread(target=self.__connect_socket, args=(hostname, port))
        self.__thread.start()
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

    def guide(self, recalibrate=True, settle={}):
        self.__send_method('guide', [self.settle, recalibrate])

    def dither(self, pixels, settle={}):
        self.__send_method('dither', [pixels, False, self.settle])

    def stop(self):
        self.__send_method('stop_capture')
        pass

    def status(self):
        return {}

    def __send_method(self, method_name, parameters=[]):
        id = int(time.time() * 1000)
        self.out_queue.put({
            'method': method_name,
            'params': parameters,
            'id': id,
        })
        return id

    def __connect_socket(self, address, port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as connection:
            try:
                connection.connect((address, port))
                self.recv_queue.put({ 'connected': True })
            except Exception as e:
                self.recv_queue.put({ 'connected': False, 'error': e })
                return 
            inout = [connection]
            fileobj = connection.makefile()
            while self.__connect:
                infds, outfds, errfds = select.select(inout, inout, [], 0)
                if infds:
                    line = fileobj.readline()
                    logger.debug(line)
                if outfds:
                    try:
                        message = self.out_queue.get_nowait()
                        connection.send('{}\r\n'.format(json.dumps(message)).encode() )
                    except Empty:
                        pass
