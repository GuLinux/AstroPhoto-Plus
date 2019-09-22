from utils.mp import mp_start_process, mp_queue
import queue
from app import logger
import time
import commands


class PHD2Process:
    def __init__(self, i_queue, o_queue):
        self.i_queue = i_queue
        self.o_queue = o_queue
        self.__running = True

    def run(self):
        while self.__running:
            self.get_command()
            time.sleep(1)
            logger.debug('PHD2 Process: ping')

    def get_command(self):
        try:
            self.i_queue.get_nowait()(process=self)
        except queue.Empty:
            pass

    def stop(self):
        self.__running = False


class PHD2Service:
    def __init__(self):
        self.i_queue, self.o_queue = mp_queue(), mp_queue()
        self.__process = None

    def start(self):
        self.__process = mp_start_process(self.__run_process, self.o_queue, self.i_queue)

    def stop(self):
        if self.__process:
            self.o_queue.put(commands.StopService())
            self.__process = None

    def __run_process(self, *args, **kwargs):
        phd2_process = PHD2Process(*args, **kwargs)
        phd2_process.run()
