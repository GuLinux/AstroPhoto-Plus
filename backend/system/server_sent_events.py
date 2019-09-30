import json
import uuid
import time
from utils.mp import mp_start_process, mp_queue
from flask_sse import sse
from app import logger 


class SSEMessage:
    def __init__(self, data, type, id=None):
        self.data = data
        self.type = type
        self.id = id

    def to_str(self):
        data = json.dumps(self.data)
        lines = ["data:{}".format(line) for line in data.splitlines()]
        lines.insert(0, "event:{value}".format(value=self.type))
        if self.id:
            lines.append("id:{value}".format(value=self.id))
        return "\n".join(lines) + "\n\n"

class SSEClient:
    def __init__(self, sse):
        self.queue = mp_queue()
        self.sse = sse

    def publish(self, message):
        self.queue.put(message)

    def feed(self):
        def gen():
            yield ':{}\n'.format(' ' * 2049)
            while True:
                try:
                    yield self.queue.get().to_str()
                except GeneratorExit:
                    self.sse.unsubscribe(self)
                    return
        return gen()
 
class SSE:
    def __init__(self):
        self.clients = []

    def publish(self, data, type):
        mp_start_process(self.__publish_to_clients, data, type)

    def publish_event(self, event_type, event_name, payload, is_error=False, error_code=None):
        self.publish({'event': event_name, 'payload': payload, 'is_error': is_error, 'error_code': error_code}, type=event_type)

    def __publish_to_clients(self, data, type):
        for client in self.clients:
            client.publish(SSEMessage(data, type, time.time()))


    def subscribe(self):
        new_client = SSEClient(self)
        self.clients.append(new_client)
        logger.info('new client subscribed: {}'.format(new_client))
        return new_client

    def unsubscribe(self, client):
        logger.info('unsubscribing client: {} (clients: {})'.format(client, len(self.clients)))
        self.clients = [x for x in self.clients if x != client]
        logger.debug('clients now: {}'.format(len(self.clients)))
               
        
sse = SSE()
