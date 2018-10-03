from errors import BadRequestError
import time
from utils.threads import start_thread

class RunningSequence:
    def __init__(self, sequence, controller, logger, on_finished=None):
        self.sequence = sequence
        self.controller = controller
        self.logger = logger
        self.thread = start_thread(self.__run)
        self.on_finished = on_finished

    def __on_updated(self):
        self.controller.event_listener.on_sequence_update(self.sequence)
        self.controller.sequences.save(self.sequence)

    def __run(self):
        # TODO: not ideal, find a better solution
        # Let the HTTP thread return a response, then start the thread
        time.sleep(1)
        try:
            self.sequence.run(self.controller.indi_server, self.controller.settings.sequences_dir, self.controller.event_listener, self.logger, on_update=self.__on_updated)
        except Exception as e:
            self.logger.exception('unhandled exception while running sequence')
            self.controller.event_listener.on_sequence_error(self.sequence, str(e))
        finally:
            if self.on_finished:
                self.on_finished(self)

    def stop(self):
        self.sequence.stop(on_update=self.__on_updated)

class SequencesRunner:
    def __init__(self, logger, controller):
        self.logger = logger
        self.controller = controller
        self.running_sequences = {}
        

    def run(self, sequence_id):
        if not self.controller.indi_server.is_connected():
            raise BadRequestError('INDI server not connected.')
        sequence = self.controller.sequences.lookup(sequence_id)
        def cleanup_sequence(_):
            del self.running_sequences[sequence_id]

        running_sequence = RunningSequence(sequence, self.controller, self.logger, on_finished=cleanup_sequence)
        self.running_sequences[sequence_id] = running_sequence

    def get(self, sequence_id):
        return self.running_sequences.get(sequence_id)

    def is_running(self, sequence_id):
        return sequence_id in self.running_sequences

