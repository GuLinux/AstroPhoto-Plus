import multiprocessing
import threading
import queue
from app import logger


def Worker(model='threading'):

    def wrapper(Cls):
        default_init = Cls.__init__

        def get_queue(self, maxsize=0):
            return multiprocessing.Queue(maxsize) if model == 'multiprocessing' else queue.Queue(maxsize)

        def new_init(self, *args, **kwargs):
            default_init(self, *args, **kwargs)
            self.methods_queue = self.get_queue()
            self.replies_queue = self.get_queue()
            self.__process = None

        def execute(self, method_name, *args, sync=True, **kwargs):
            self.methods_queue.put((method_name, args, kwargs))
            if sync:
                result = self.replies_queue.get()
                payload, exception_class = result
                if exception_class:
                    raise exception_class(*payload)
                return payload

        def stop(self):
            self.execute('stop', sync=True)
            self.__process.join()
            self.__process = None

        def __run(self, methods_queue, replies_queue):
            on_run = getattr(self, 'on_run', None)
            on_started = getattr(self, 'on_start', None)
            on_stopped = getattr(self, 'on_stopped', None)
            if on_started:
                on_started()
            try:
                while True:
                    try:
                        method, args, kwargs = methods_queue.get_nowait()
                        if method == 'stop':
                            replies_queue.put((True, None))
                            return
                        try:
                            result = getattr(self, method)(*args, **kwargs)
                            replies_queue.put((result, None))
                        except Exception as e:
                            replies_queue.put((e.args, type(e)))
                    except queue.Empty:
                        pass
                    except Exception as e:
                        logger.warning('Exception on {} __run: '.format(Cls), exc_info=e)
                    if on_run:
                        on_run()
            finally:
                if on_stopped:
                    on_stopped()

        
        def start(self):
            if model == 'multiprocessing':
                self.__process = multiprocessing.Process(target=self.__run, args=(self.methods_queue, self.replies_queue))
            else:
                self.__process = threading.Thread(target=self.__run, args=(self.methods_queue, self.replies_queue))
            self.__process.start()

        def is_running(self):
            return self.__process and self.__process.is_alive()

        Cls.__init__ = new_init
        Cls.execute = execute
        Cls.stop = stop
        Cls.__run = __run
        Cls.start = start
        Cls.get_queue = get_queue
        Cls.is_running = is_running
        return Cls
    return wrapper

