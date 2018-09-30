import multiprocessing

def mp_queue(maxsize=0):
    return multiprocessing.Queue(maxsize)

def mp_process(target, *args, **kwargs):
    return multiprocessing.Process(target=target, args=args, kwargs=kwargs)

def mp_start_process(target, *args, **kwargs):
    process = mp_process(target, *args, **kwargs)
    process.start()
    return process

