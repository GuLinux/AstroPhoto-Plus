class PHD2ConnectionError(Exception):
    def __init__(self, message, parent=None):
        self.message = message
        self.parent = parent

class PHD2MethodError(Exception):
    def __init__(self, method, message, code):
        self.method = method
        self.message = message
        self.code = code

    def get_message(self):
        return 'Error code {} calling PHD2 method {}: {}'.format(self.code, self.method, self.message)

    def __str__(self):
        return self.get_message()

    def __repr__(self):
        return self.__str__()



