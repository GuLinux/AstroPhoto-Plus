import subprocess
import time
import shlex
import os


class CommandSequenceItem:
    def __init__(self, data):
        self.command= data['command']
       
    def to_map(self):
        return {
            'command': self.command,
        }

    def run(self, server, devices, root_path, logger, on_update, index):
        os.makedirs(root_path, exist_ok=True)

        with open(os.path.join(root_path, self.__log_filename(index, 'stdout')), 'w') as out:
            with open(os.path.join(root_path, self.__log_filename(index, 'stderr')), 'w') as err:
                logger.debug('writing stdout/stderr for command {} in {}'.format(self.command, root_path))
                cmd_description = 'command: {}\n'.format(self.command)
                out.write(cmd_description)
                err.write(cmd_description)

                result = subprocess.run(shlex.split(self.command), stdout=out, stderr=err)
                logger.debug(os.listdir(root_path))

            if result.returncode != 0:
                raise RuntimeError('Error running command {}'.format(self.command))

    def reset(self):
        pass

    def __log_filename(self, index, suffix):
        time_str = time.strftime('%Y-%m-%dT%H:%M:%S')
        return '{:04}-run-command-{}-{}.log'.format(index, time_str, suffix)

