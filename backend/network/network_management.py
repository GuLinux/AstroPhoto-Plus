import NetworkManager
import uuid
import json

### MonkeyPatching NetworkManager module: https://github.com/seveas/python-networkmanager/issues/76
NetworkManager.device_class_orig = NetworkManager.device_class
def __device_class_patch(typ):
    try:
        return NetworkManager.device_class_orig(typ)
    except KeyError:
        return NetworkManager.Generic

NetworkManager.device_class = __device_class_patch
### End MonkeyPatching

class NetworkManagementError(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)


class NetworkConnection:
    def __init__(self, nm_connection):
        self.nm_connection = nm_connection
        self.id = nm_connection.GetSettings()['connection']['id']

    def activate(self, device):
        NetworkManager.NetworkManager.ActivateConnection(self.nm_connection, device, '/')

    def deactivate(self):
        connection = [c for c in NetworkManager.NetworkManager.ActiveConnections if c.Connection.GetSettings()['connection']['id'] == self.id]
        if not connection:
           raise NetworkManagementError('Connection not active: "{}", unable to deactivate.'.format(self.id))
        NetworkManager.NetworkManager.DeactivateConnection(connection[0])

    def remove(self):
        self.nm_connection.Delete()

    @property
    def type(self):
        connection_type = self.nm_connection.GetSettings()['connection']['type']
        if connection_type == '802-3-ethernet':
            return 'ethernet'
        if connection_type == '802-11-wireless':
            return 'wifi'
        return 'unknown'

    def __str__(self):
        return json.dumps(self.nm_connection.GetSettings(), indent=4)

    def __repr__(self):
        return self.__str__()

class AccessPoint:
    def __init__(self, nm_ap):
        self.nm_ap = nm_ap

    @property
    def ssid(self):
        return self.nm_ap.Ssid

    @property
    def frequency(self):
        return self.nm_ap.Frequency

    @property
    def strength(self):
        return self.nm_ap.Strength

    @property
    def hwaddr(self):
        return self.nm_ap.HwAddress

    def __str__(self):
        return '{}: freq {}, strength {}'.format(self.ssid, self.frequency, self.strength)

    def __repr__(self):
        return self.__str__()


class NetworkManagement:

    def list_connections(self):
        return [NetworkConnection(c) for c in NetworkManager.Settings.Connections]

    def activate_connection(self, connection_id, device=None):
        connection = self.__find_connection_by_id(connection_id)
        connection.activate(self.__find_device_for_connection(connection, device))

    def access_points(self):
        wifi_devs = self.__wifi_devices()
        access_points = []
        for dev in wifi_devs:
            access_points.extend([AccessPoint(nm_ap) for nm_ap in dev.GetAccessPoints() if not nm_ap.HwAddress in [ap.hwaddr for ap in access_points] ])
        return access_points

    def add_wifi(self, ssid, psk, autoconnect=False, priority=0, ap_mode=False):
        wireless_mode = 'ap' if ap_mode else 'infrastructure'
        ipv4_method = 'shared' if ap_mode else 'auto'

        connection_object = {
            '802-11-wireless': {
                'mode': wireless_mode,
                'security': '802-11-wireless-security',
                'ssid': ssid,
            },
            '802-11-wireless-security': {
                'auth-alg': 'open',
                'key-mgmt': 'wpa-psk',
                'psk': psk,
            },
            'connection': {
                'id': ssid,
                'type': '802-11-wireless',
                'uuid': str(uuid.uuid4()),
                'autoconnect': autoconnect,
            },
            'ipv4': { 'method': ipv4_method },
            'ipv6': { 'method': 'ignore' },

        }
        if autoconnect:
            connection_object['connection']['autoconnect-priority'] = priority
        NetworkManager.Settings.AddConnection(connection_object)
 
    def remove_connection(self, connection_id):
        connection = self.__find_connection_by_id(connection_id)
        connection.remove()

    def deactivate_connection(self, connection_id):
        connection = self.__find_connection_by_id(connection_id)
        connection.deactivate()

    def active_connections(self):
        return [NetworkConnection(c.Connection) for c in NetworkManager.NetworkManager.ActiveConnections]

    def __find_device_for_connection(self, connection, device=None):
        if device:
            return self.__find_device(device)
        devices = []
        if connection.type == 'wifi':
            devices = self.__wifi_devices()
        elif connection.type == 'ethernet':
            devices = self.__ethernet_devices()
        if not devices:
            raise NetworkManagementError('Connection type unsupported')
        return devices[0]

    def __find_connection_by_id(self, connection_id):
        connection = [c for c in self.list_connections() if c.id == connection_id]
        if not connection:
            raise NetworkManagementError('Unknown connection')
        return connection[0]


    def __wifi_devices(self):
        return self.__devices_by_type(NetworkManager.NM_DEVICE_TYPE_WIFI)

    def __ethernet_devices(self):
        return self.__devices_by_type(NetworkManager.NM_DEVICE_TYPE_ETHERNET)

    def __devices_by_type(self, device_type):
        return [dev for dev in NetworkManager.NetworkManager.GetDevices() if dev.DeviceType == device_type]

    def __find_device(self, interface):
        devices = [dev for dev in NetworkManager.NetworkManager.GetDevices() if dev.Interface == interface]
        if not devices:
            raise NetworkManagementError('Device {} not found'.format(interface))
        return devices[0]






