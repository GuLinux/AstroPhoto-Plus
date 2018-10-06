import threading
import queue

def thread_queue(maxsize=0):
    return queue.Queue(maxsize)

def new_thread(target, *args, **kwargs):
    return threading.Thread(target=target, args=args, kwargs=kwargs)

def start_thread(target, *args, **kwargs):
    t = new_thread(target, *args, **kwargs)
    t.start()
    return t

def lock(timeout=-1):
    return threading.Lock()

