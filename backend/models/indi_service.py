import os
from xml.etree import ElementTree
from .service import Service

class INDIService:
    def __init__(self, settings, on_started=None, on_exit=None):
        self.settings = settings
        self.indi_prefix = settings.indi_prefix
        self.indiserver_path = self.__binpath('indiserver')
        self.indi_drivers_path = os.path.join(self.indi_prefix, 'share', 'indi')
        self.on_started = on_started
        self.on_exit = on_exit
        self.service = Service('indiserver', settings.indi_service_logs)
        self.groups = {}
        self.drivers = {}
        self.devices_running = []
        if self.server_exists:
            self.__parse_drivers()

    @property
    def server_exists(self):
        return os.path.isfile(self.indiserver_path) and os.access(self.indiserver_path, os.X_OK) and os.path.isdir(self.indi_drivers_path)

    def to_map(self):
        props = {
            'server_found': self.server_exists,
            'groups': self.groups,
            'drivers': self.drivers,
        }
        props.update(self.status())
        return props

    def status(self):
        return {
            'is_running': self.service.is_running(),
            'is_error': self.service.is_error(),
            'devices_enabled': self.devices_running,
        }

    def start(self, devices):
        if not self.server_exists:
            raise RuntimeError('INDI Server not found in {}'.format(self.indi_prefix))
        if not devices:
            raise RuntimeError('Start called without devices')
        if self.service.is_running():
            raise RuntimeError('Service is already running')

        driver_binaries = [self.__binpath(self.drivers[device]['binary']) for device in devices]
        self.service.start(self.indiserver_path, driver_binaries, on_started=lambda service: self.on_started(devices, service), on_exit=self.on_exit)
        self.devices_running = devices

    def stop(self, *args, **kwargs):
        self.service.stop(*args, **kwargs)

    def __parse_drivers(self):
        for file in os.listdir(self.indi_drivers_path):
            if file.endswith(".xml") and not file.endswith('_sk.xml'):
                self.__parse_indi_xml(file)

    def __binpath(self, name):
        return os.path.join(self.indi_prefix, 'bin', name)

    def __parse_indi_xml(self, driver):
        tree = ElementTree.parse(os.path.join(self.indi_drivers_path, driver))
        root = tree.getroot()
        drivers = {}
        if root.tag != 'driversList':
            return {}
        for group in root:
            self.__parse_group(group)

    def __parse_group(self, group):
        if group.tag != 'devGroup':
            return
        name = group.attrib['group']
        if not name in self.groups:
            self.groups[name] = { 'name': name, 'drivers': [] }

        for device in group:
            driver = self.__parse_device(device)
            if driver:
                self.groups[name]['drivers'].append(driver['name'])
                self.drivers[driver['name']] = driver

    def __parse_device(self, device):
        driver = { 'label': device.attrib['label'] }
        for child in device:
            if child.tag == 'version':
                driver['version'] = child.text
            elif child.tag == 'driver':
                driver['name'] = child.attrib['name']
                driver['binary'] = child.text
        return driver

