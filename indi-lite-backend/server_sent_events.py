from queue import Queue
import json


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

    def new_message(self, message):
        self.queue.put(message)

    def feed(self):
        def gen():
            while True:
                try:
                    yield self.queue.get().to_str()
                except GeneratorExit:
                    self.sse.unsubscribe(self)
        return gen()
 

class SSE:
    def __init__(self):
        self.clients = []

    def publish(self, data, type):
        for client in self.clients:
            client.new_message(SSEMessage(data, type))

    def subscribe(self):
        new_client = SSEClient(self)
        self.clients.append(new_client)
        return new_client

    def unsubscribe(self, client):
        print('unsubscribing client: {} (clients: {})'.format(client, len(self.clients)))
        self.clients = [x for x in self.clients if x != client]
        print('clients now: {}'.format(len(self.clients)))
               
        
