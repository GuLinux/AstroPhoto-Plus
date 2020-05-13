from utils.threads import start_thread
import socket
import time
from system import settings

BROADCAST_PORT = 27181

def __broadcast_loop():
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    # Set a timeout so the socket does not block
    # indefinitely when trying to receive data.
    server.settimeout(0.2)
    server.bind(("", BROADCAST_PORT - 1))
    message = '\x1f'.join(['astrophoto+', str(settings.web_application_port), settings.server_name, settings.web_protocol]).encode()
    while True:
        try:
            written = server.sendto(message, ('<broadcast>', BROADCAST_PORT))
        except OSError:
            # Ignore errors when disconnected from network
            pass
        time.sleep(2)

def broadcast_service():
    start_thread(__broadcast_loop)


