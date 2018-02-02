from pyindi_sequence import INDIClient

class Server:
    def __init__(self, host, port):
        self.host = host
        self.port = port

    def to_map(self):
        return {'host': self.host, 'port': self.port}

