class BadRequestError(Exception):
    def __init__(self, message=None, payload=None):
        Exception.__init__(self,message)
        self.message = message
        self.payload = payload

class NotFoundError(Exception):
    def __init__(self, message=None, payload=None):
        Exception.__init__(self, message)
        self.message = message
        self.payload = payload

class FailedMethodError(Exception):
    def __init__(self, message=None, payload=None):
        Exception.__init__(self, message)
        self.message = message
        self.payload = payload
