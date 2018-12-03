import os
import subprocess
from utils.threads import start_thread
from app import logger
from utils.cleanup_venv import clean_environment


class Service:
    def __init__(self, name, logs_directory):
        self.name = name
        self.process = None
        os.makedirs(logs_directory, exist_ok=True)
        self.stdout_path = os.path.join(logs_directory, name + '-stdout.log')
        self.stderr_path = os.path.join(logs_directory, name + '-stderr.log')



    def status(self):
        return {
            'is_running': self.is_running(),
            'exit_code': self.exit_code(),
            'error': self.is_error(),
        }

    def is_running(self):
        return self.__has_process() and self.process.poll() == None

    def exit_code(self):
        if not self.__has_process() or self.is_running():
            return None
        return self.process.poll()

    def is_error(self):
        exit_code = self.exit_code()
        return exit_code != None and exit_code != 0

    def start(self, command, arguments, on_started=None, on_exit=None, env=None):
        if self.is_running():
            raise RuntimeError('Process is already running.')
        args = [command]
        args.extend(arguments)
        if env is None:
            env = clean_environment()
           
        def run_process():
            with open(self.stdout_path, 'w') as stdout_fd:
                with open(self.stderr_path, 'w') as stderr_fd:
                    self.process = subprocess.Popen(args, stdout=stdout_fd, stderr=stderr_fd, env=env)
                    if on_started:
                        on_started(self)
                    self.process.wait()
                    if on_exit:
                        on_exit(self)
        start_thread(target=run_process)

    def stop(self, kill=False, wait=False):
        if not self.is_running():
            return
        if kill:
            self.process.kill()
        else:
            self.process.terminate()
        if wait:
            self.process.wait()

    def get_stdout(self):
        if not os.path.isfile(self.stdout_path):
            raise RuntimeError('stdout logfile for {} not existing'.format(self.name))
        return open(self.stdout_path, 'r')

    def get_stderr(self):
        if not os.path.isfile(self.stderr_path):
            raise RuntimeError('stderr logfile for {} not existing'.format(self.name))
        return open(self.stderr_path, 'r')

    def __has_process(self):
        return self.process != None
