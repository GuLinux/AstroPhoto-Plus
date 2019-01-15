import subprocess
import time
import shlex
import os
from app import logger
from utils.cleanup_venv import clean_environment


class CommandSequenceJob:
    def __init__(self, data):
        self.command= data['command']
        self.logfiles = data.get('logfiles', [])
       
    def to_map(self):
        return {
            'command': self.command,
            'logfiles': self.logfiles,
            'has_files': len(self.logfiles) > 0,
        }

    def run(self, server, devices, root_path, event_listener, on_update, index):
        os.makedirs(root_path, exist_ok=True)

        with open(os.path.join(root_path, self.__log_filename(index, 'stdout')), 'w') as out:
            self.logfiles.append(out.name)
            with open(os.path.join(root_path, self.__log_filename(index, 'stderr')), 'w') as err:
                self.logfiles.append(err.name)
                logger.debug('writing stdout/stderr for command {} in {}'.format(self.command, root_path))
                cmd_description = 'command: {}\n'.format(self.command)
                out.write(cmd_description)
                err.write(cmd_description)

                result = subprocess.run(shlex.split(self.command), stdout=out, stderr=err, env=clean_environment())

            if result.returncode != 0:
                raise RuntimeError('Error running command {}'.format(self.command))

    def reset(self, remove_files=False):
        if remove_files:
            self.__remove_files()

    def on_deleted(self, remove_files=False):
        if remove_files:
            self.__remove_files()

    def __remove_files(self):
        for logfile in self.logfiles:
            if os.path.exists(logfile):
                os.remove(logfile)
        self.logfiles = []


 

    def __log_filename(self, index, suffix):
        time_str = time.strftime('%Y-%m-%dT%H:%M:%S')
        return '{:04}-run-command-{}-{}.log'.format(index, time_str, suffix)

