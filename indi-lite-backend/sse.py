import json
from queue import Queue, Empty
import time
import uuid

class SSEEvent:
    def __init__(self, data, type, id):   
        self.data = data
        self.type = type
        self.id = id

    def to_str(self):
        lines = ['data:{}'.format(line) for line in json.dumps(self.data).splitlines()]
        lines.insert(0, 'event:{}'.format(self.type))
        lines.append('id:{}'.format(self.id))
        return '\n'.join(lines) + '\n\n'


class SSE:
    def __init__(self):
        self.clients = []

    def subscribe(self, client):
        print('client subscribed')
        self.clients.append(client)

    def unsubscribe(self, client):
        self.clients = [c for c in self.clients if c != client]
        print('client unsubscribed')

    def publish(self, data, type=None, id=None):
        for c in self.clients:
            c.publish(SSEEvent(data, type, id))

sse = SSE()

class SSEClient:
    def __init__(self):
        sse.subscribe(self)
        self.queue = Queue()

    def publish(self, event):
        self.queue.put(event)

    def stream(self):
        last_event = 0
        while True:
            try:
                event = self.queue.get(block=False)
                print('got event: {}'.format(event))
                yield event.to_str()
                last_event = time.time()
            except Empty:
                if time.time() - last_event > 25:
                    self.publish(SSEEvent({'type': 'heartbeat'}, 'heartbeat', uuid.uuid4().hex))
