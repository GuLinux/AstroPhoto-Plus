from models import BadRequestError
import gevent
import sys

class RunningSequence:
    def __init__(self, sequence, controller, logger):
        self.sequence = sequence
        self.controller = controller
        self.logger = logger
        self.thread = gevent.spawn(self.__run)
        self.callbacks = {}

    def __run(self):
        self.logger.debug('Inside sequence thread')
        try:
            self.sequence.run(self.controller.indi_server, self.controller.root_path, self.logger, callbacks=self.callbacks)
        except:
            self.logger.exception('unhandled exception while running sequence')

class SequencesRunner:
    def __init__(self, logger, controller):
        self.logger = logger
        self.controller = controller
        self.running_sequences = []
        

    def run(self, sequence_id):
        if not self.controller.indi_server.is_connected():
            raise BadRequestError('INDI server not connected.')
        sequence = self.controller.sequences.lookup(sequence_id)
        running_sequence = RunningSequence(sequence, self.controller, self.logger)
        self.running_sequences.append(running_sequence)
        #running_sequence.start()
