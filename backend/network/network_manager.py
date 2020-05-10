#!/bin/env python3
import NetworkManager as NM
import uuid
import json
import argparse

### MonkeyPatching NetworkManager module: https://github.com/seveas/python-networkmanager/issues/76
NM.device_class_orig = NM.device_class
def __device_class_patch(typ):
    try:
        return NM.device_class_orig(typ)
    except KeyError:
        return NM.Generic

NM.device_class = __device_class_patch
### End MonkeyPatching

class NetworkManagerError(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)


class NetworkConnection:
    def __init__(self, nm_connection):
        self.nm_connection = nm_connection
        self.id = nm_connection.GetSettings()['connection']['id']

    def activate(self, device):
        NM.NetworkManager.ActivateConnection(self.nm_connection, device, '/')

    def deactivate(self):
        connection = [c for c in NM.NetworkManager.ActiveConnections if c.Connection.GetSettings()['connection']['id'] == self.id]
        if not connection:
           raise NetworkManagerError('Connection not active: "{}", unable to deactivate.'.format(self.id))
        NM.NetworkManager.DeactivateConnection(connection[0])

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



class NetworkManager:

    def list_connections(self):
        return [NetworkConnection(c) for c in NM.Settings.Connections]

    def activate_connection(self, connection_id, device=None):
        connection = self.__find_connection_by_id(connection_id)
        connection.activate(self.__find_device_for_connection(connection, device))

    def access_points(self):
        wifi_devs = self.__wifi_devices()
        access_points = []
        for dev in wifi_devs:
            access_points.extend([AccessPoint(nm_ap) for nm_ap in dev.GetAccessPoints() if not nm_ap.HwAddress in [ap.hwaddr for ap in access_points] ])
        return access_points

    def add_wifi(self, ssid, psk, autoconnect=False, priority=0, ap_mode=False, nm_id=None):
        wireless_mode = 'ap' if ap_mode else 'infrastructure'
        ipv4_method = 'shared' if ap_mode else 'auto'
        if not nm_id:
            nm_id = ssid

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
                'id': nm_id,
                'type': '802-11-wireless',
                'uuid': str(uuid.uuid4()),
                'autoconnect': autoconnect,
            },
            'ipv4': { 'method': ipv4_method },
            'ipv6': { 'method': 'ignore' },

        }
        if autoconnect:
            connection_object['connection']['autoconnect-priority'] = priority
        NM.Settings.AddConnection(connection_object)
 
    def remove_connection(self, connection_id):
        connection = self.__find_connection_by_id(connection_id)
        connection.remove()

    def deactivate_connection(self, connection_id):
        connection = self.__find_connection_by_id(connection_id)
        connection.deactivate()

    def active_connections(self):
        return [NetworkConnection(c.Connection) for c in NM.NetworkManager.ActiveConnections]

    def __find_device_for_connection(self, connection, device=None):
        if device:
            return self.__find_device(device)
        devices = []
        if connection.type == 'wifi':
            devices = self.__wifi_devices()
        elif connection.type == 'ethernet':
            devices = self.__ethernet_devices()
        if not devices:
            raise NetworkManagerError('Connection type unsupported')
        return devices[0]

    def __find_connection_by_id(self, connection_id):
        connection = [c for c in self.list_connections() if c.id == connection_id]
        if not connection:
            raise NetworkManagerError('Unknown connection: {}'.format(connection_id))
        return connection[0]


    def __wifi_devices(self):
        return self.__devices_by_type(NM.NM_DEVICE_TYPE_WIFI)

    def __ethernet_devices(self):
        return self.__devices_by_type(NM.NM_DEVICE_TYPE_ETHERNET)

    def __devices_by_type(self, device_type):
        return [dev for dev in NM.NetworkManager.GetDevices() if dev.DeviceType == device_type]

    def __find_device(self, interface):
        devices = [dev for dev in NM.NetworkManager.GetDevices() if dev.Interface == interface]
        if not devices:
            raise NetworkManagerError('Device {} not found'.format(interface))
        return devices[0]



if __name__ == '__main__':
    nm = NetworkManager()
    def list_connections(_):
        for c in nm.list_connections():
            print('{} (type: {})'.format(c.id, c.type))

    def active_connections(_):
        for c in nm.active_connections():
            print('{} (type: {})'.format(c.id, c.type))

    def activate_connection(args):
        nm.activate_connection(args.name, args.device)

    def add_wifi(args):
        nm.add_wifi(args.ESSID, args.PSK, args.autoconnect, args.autoconnect_priority, args.access_point, arg.name)

    def access_points(_):
        for ap in nm.access_points():
            print('ESSID: {}, frequency: {}, strength: {}'.format(ap.ssid, ap.frequency, ap.strength))

    def deactivate_connection(args):
        nm.deactivate_connection(args.name)

    def remove_connection(args):
        nm.remove_connection(args.name)

    parser = argparse.ArgumentParser(description='AstroPhoto Plus Network Manager')
    subparsers = parser.add_subparsers(title='Commands', description='Available Commands', dest='subcommand')
    parser_connections = subparsers.add_parser('connections', help='Show all connections')
    parser_connections.set_defaults(func=list_connections)

    parser_active_connections = subparsers.add_parser('active-connections', help='Show active connections')
    parser_active_connections.set_defaults(func=active_connections)

    parser_activate_connection = subparsers.add_parser('activate', help='Activate connection')
    parser_activate_connection.add_argument('name', help='Connection name')
    parser_activate_connection.add_argument('--device', default=None, help='Force device for activation (default: first available interface)')
    parser_activate_connection.set_defaults(func=activate_connection)

    parser_add_wifi = subparsers.add_parser('add-wifi', help='Add new WiFi connection')
    parser_add_wifi.add_argument('ESSID', help='Connection ESSID (name)')
    parser_add_wifi.add_argument('PSK', help='Connection passkey')
    parser_add_wifi.add_argument('--name', default=None, help='NetworkManager connection name (default: ESSID)')
    parser_add_wifi.add_argument('--autoconnect', default=False, help='Autoconnect enabled (default: False)')
    parser_add_wifi.add_argument('--autoconnect-priority', default=0, help='Autoconnect priority (default: 0)')
    parser_add_wifi.add_argument('--access-point', default=False, help='Shared/Access Point Mode (default: False)')
    parser_add_wifi.set_defaults(func=add_wifi)

    parser_access_points = subparsers.add_parser('access-points', help='List access points')
    parser_access_points.set_defaults(func=access_points)

    parser_remove_connection = subparsers.add_parser('remove', help='Remove connection from NetworkManager')
    parser_remove_connection.add_argument('name', help='Connection name')
    parser_remove_connection.set_defaults(func=remove_connection)

    parser_deactivate_connection = subparsers.add_parser('deactivate', help='Deactivates connection')
    parser_deactivate_connection.add_argument('name', help='Connection name')
    parser_deactivate_connection.set_defaults(func=deactivate_connection)



    args = parser.parse_args()

    if not args.subcommand:
        parser.print_help()
    else:
        args.func(args)
