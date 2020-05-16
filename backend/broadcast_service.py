from utils.threads import start_thread
import socket
import time
from system import settings, syslog
import psutil

BROADCAST_PORT = 27181

def __broadcast_loop():
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    # Set a timeout so the socket does not block
    # indefinitely when trying to receive data.
    server.settimeout(0.2)
    message = '\x1f'.join(['astrophoto+', str(settings.web_application_port), settings.server_name, settings.web_protocol]).encode()
    while True:
        try:
            for iface, addresses in psutil.net_if_addrs().items():
                for address in addresses:
                    if address.broadcast:
                        # syslog('Sending broadcast to interface {} on broadcast address {}'.format(iface, address.broadcast))
                        written = server.sendto(message, (address.broadcast, BROADCAST_PORT))
        except OSError as e:
            # Ignore errors when disconnected from network
            # syslog('Error while sending broadcast: {}'.format(e))
            pass
        time.sleep(2)

def broadcast_service():
    start_thread(__broadcast_loop)


