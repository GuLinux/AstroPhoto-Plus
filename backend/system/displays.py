import os

def x11_display_object(socket):
    if socket.startswith('X'):
        return {
            'socket': socket,
            'display_number': socket[1:],
            'display_variable': ':{}'.format(socket[1:]),
        }
    return None

def x11_displays():
    objects = [x11_display_object(socket) for socket in os.listdir('/tmp/.X11-unix')]
    return [x11_display for x11_display in objects if x11_display]

