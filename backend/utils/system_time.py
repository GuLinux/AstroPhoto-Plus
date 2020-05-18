import time
import subprocess
from errors import FailedMethodError

def set_ntp(enabled):
    return subprocess.run(['sudo', 'timedatectl', 'set-ntp', 'true' if enabled else 'false']).returncode == 0

def get_timestamp():
    return { 'utc_timestamp': time.time() }

def set_timestamp(timestamp):
    timestamp = int(timestamp)
    if not __set_timestamp_timedatectl(timestamp):
        if not __set_timestamp_date(timestamp):
            raise FailedMethodError('Unable to set system time')
    return get_timestamp()

def __set_timestamp_timedatectl(timestamp):
    return set_ntp(False) and subprocess.run(['sudo', 'timedatectl', 'set-time', '@{}'.format(timestamp)]).returncode == 0


def __set_timestamp_date(timestamp):
    return subprocess.run(['sudo', 'date', '-s', '@{}'.format(timestamp)]).returncode == 0


