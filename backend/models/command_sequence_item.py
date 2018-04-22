import os


class CommandSequenceItem:
    def __init__(self, data):
        self.command= data['command']
       
    def to_map(self):
        return {
            'command': self.command,
        }

    def run(self, server, devices, root_path, logger, on_update):
        exit_code = os.system(self.command)
        if exit_code != 0:
            raise RuntimeError('Error running command {}'.format(self.command))

    def reset(self):
        pass

