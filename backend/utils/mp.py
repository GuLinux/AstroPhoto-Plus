import multiprocessing
import queue

def mp_queue(maxsize=0):
    return multiprocessing.Queue(maxsize)

def mp_process(target, *args, **kwargs):
    return multiprocessing.Process(target=target, args=args, kwargs=kwargs)

def mp_start_process(target, *args, **kwargs):
    process = mp_process(target, *args, **kwargs)
    process.start()
    return process


def ProcessWorker(Cls):
    default_init = Cls.__init__

    def new_init(self, *args, **kwargs):
        default_init(self, *args, **kwargs)
        self.methods_queue = mp_queue()
        self.replies_queue = mp_queue()
        self.__process = None

    def execute(self, method_name, *args, sync=True, **kwargs):
        self.methods_queue.put((method_name, args, kwargs))
        if sync:
            payload, exception_class = self.replies_queue.get()
            if exception_class:
                raise exception_class(*payload)
            return payload

    def stop(self):
        self.execute('stop', sync=True)
        self.__process.join()
        self.__process = None

    def __run(self):
        on_run = getattr(self, 'on_run', None)
        while True:
            try:
                method, args, kwargs = self.methods_queue.get_nowait()
                if method == 'stop':
                    self.replies_queue.put((True, None))
                    return
                try:
                    result = getattr(self, method)(*args, **kwargs)
                    self.replies_queue.put((result, None))
                except Exception as e:
                    self.replies_queue.put((e.args, type(e)))
            except queue.Empty:
                pass
            if on_run:
                on_run()
    
    def start(self):
        self.__process = mp_start_process(self.__run)

    def is_running(self):
        return self.__process and self.__process.is_alive()

    Cls.__init__ = new_init
    Cls.execute = execute
    Cls.stop = stop
    Cls.__run = __run
    Cls.start = start
    Cls.is_running = is_running
    return Cls

