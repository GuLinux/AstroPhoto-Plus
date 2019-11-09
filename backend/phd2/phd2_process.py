import subprocess
from errors import FailedMethodError, BadRequestError 

class PHD2Process:
    def __init__(self):
        self.__process = None

    def start(self, binary_path='/usr/bin/phd2', display=None):
        if self.running:
            raise BadRequestError('PHD2 is already running')
        try:
            if not binary_path or not display:
                raise BadRequestError('Both PHD2 binary path and display must be specified')

            self.__process = subprocess.Popen(['phd2'], env={'DISPLAY': display}, stderr=subprocess.PIPE)
            return { 'started': self.running }
        except Exception as e:
            raise FailedMethodError(str(e))

    @property
    def running(self):
        return self.__process and self.__process.poll() is None

    def stop(self):
        if not self.running:
            raise BadRequestError('PHD2 is not running')

        self.__process.terminate()
        try:
            self.__process.wait(timeout=5)
            return { 'stopped': not self.running }
        except Exception as e:
            raise FailedMethodError(str(e))


