class SequenceItemStatusError(Exception):
    def __init__(self, status, message=None):
        Exception.__init__(self,message)
        self.message = message
        self.status = status


