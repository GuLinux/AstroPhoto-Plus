from models import BadRequestError
import threading
import sys

class RunningSequence:
    def __init__(self, sequence, controller, logger):
        self.sequence = sequence
        self.controller = controller
        self.logger = logger
        self.thread = threading.Thread(target=self.__run)
        self.thread.start()

    def __on_updated(self):
        self.logger.debug('sequence updated: {}'.format(self.sequence.to_map()))
        self.controller.event_listener.on_sequence_update(self.sequence)
        self.controller.sequences.save(self.sequence)

    def __run(self):
        self.logger.debug('Inside sequence thread')
        try:
            self.sequence.run(self.controller.indi_server, self.controller.root_path, self.logger, on_update=self.__on_updated)
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
