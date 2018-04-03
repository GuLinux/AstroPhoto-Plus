class BadRequestError(Exception):
    def __init__(self, message=None):
        Exception.__init__(self,message)
        self.message = message

class NotFoundError(Exception):
    def __init__(self, message=None):
        Exception.__init__(self, message)
        self.message = message


