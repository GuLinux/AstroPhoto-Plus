from .device import Device
from app import logger
from errors import NotFoundError, FailedMethodError
from datetime import datetime
from astropy.coordinates import SkyCoord, FK5
import astropy.units as u
import time

class Telescope:
    def __init__(self, settings, client, device=None, name=None):
        self.settings = settings
        self.client = client
        if device:
            self.device = Device(client, logger, device)
        elif name:
            device = [c for c in self.client.devices() if c.name == name]
            self.device = device if device else None
        if not self.device:
           raise NotFoundError('Telescope device not found: {}'.format(name)) 

    @property
    def id(self):
        return self.device.id

    def to_map(self):
        return {
            'id': self.id,
            'device': self.device.to_map(),
            'connected': self.device.connected(),
            'info': self.telescope_info(),
        }


    def telescope_info(self):
        indi_device = self.device.find_indi_device()
        if indi_device:
            return indi_device.values('TELESCOPE_INFO', 'number')
        return {}
    
    def sync(self, coordinates, equinox='J2000'):
        return self.__set_coordinates(coordinates, equinox, 'SYNC').to_map()

    def goto(self, coordinates, equinox='J2000', sync=False):
        coordinates_property = self.__set_coordinates(coordinates, equinox, 'SLEW')
        if sync:
            time.sleep(2)
            coordinates_property.reload()
            while coordinates_property.state() == 'BUSY':
                logger.debug('Waiting for telescope to slew...')
                time.sleep(1)
                coordinates_property.reload()

        return coordinates_property.to_map()


    def tracking(self, enabled):
        tracking_property = self.device.get_property('TELESCOPE_TRACK_STATE')
        tracking_property.set_values({
            'TRACK_ON': enabled,
            'TRACK_OFF': not enabled,
        })
        return tracking_property.to_map()


    def __set_coordinates(self, coordinates, equinox, onset):
        sync_property = self.device.get_property('ON_COORD_SET')
        sync_property.set_values({onset: True})
        coords = self.__tojnow(coordinates, equinox)

        coords_property = self.device.get_property('EQUATORIAL_EOD_COORD')
        coords_property.set_values({
            'RA': coords.ra.hourangle,
            'DEC': coords.dec.deg,
        })
        return coords_property


    def __tojnow(self, coordinates, equinox):
        current_datetime = datetime.now().isoformat()
        if equinox.upper() == 'JNOW':
            return SkyCoord(ra=coordinates['ra'] * u.hour, dec=coordinates['dec'] * u.deg, equinox=current_datetime)
        return SkyCoord(ra=coordinates['ra'] * u.hour, dec=coordinates['dec'] * u.deg, equinox=equinox).transform_to(FK5(equinox=current_datetime))

