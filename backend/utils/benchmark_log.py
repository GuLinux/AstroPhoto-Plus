from app import logger
import time


class BenchmarkLog:
    def __init__(self):
        self.benchs = {}
    def reset(self, tag):
         self.benchs[tag] = time.time()   

    def log(self, tag, logstring, reset=False):
        started = self.benchs.get(tag, time.time())
        if reset:
            started = time.time()
        self.benchs[tag] = time.time()
        logger.debug('[{:>30s}] [{:010.3f}] {}'.format(tag, self.benchs[tag] - started, logstring))

benchlogger = BenchmarkLog()

