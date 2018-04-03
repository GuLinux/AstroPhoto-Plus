import json
import gevent
from gevent.queue import Queue
import uuid
import time


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
        self.queue = Queue()
        self.sse = sse

    def publish(self, message):
        self.queue.put(message)

    def feed(self):
        def gen():
            while True:
                try:
                    yield self.queue.get().to_str()
                except GeneratorExit:
                    self.sse.unsubscribe(self)
                    return
        return gen()
 

class SSE:
    def __init__(self, logger):
        self.clients = []
        self.logger = logger

    def publish(self, data, type):
        gevent.spawn(self.__publish_to_clients, data, type)
        gevent.sleep(0)

    def __publish_to_clients(self, data, type):
        for client in self.clients:
            client.publish(SSEMessage(data, type, time.time()))


    def subscribe(self):
        new_client = SSEClient(self)
        self.clients.append(new_client)
        self.logger.debug('new client subscribed: {}'.format(new_client))
        return new_client

    def unsubscribe(self, client):
        self.logger.debug('unsubscribing client: {} (clients: {})'.format(client, len(self.clients)))
        self.clients = [x for x in self.clients if x != client]
        self.logger.debug('clients now: {}'.format(len(self.clients)))
               
        
