from app import logger
from redis_client import redis_client
import astropy.units as u
from astropy.coordinates import SkyCoord
from errors import NotFoundError

class Catalogs:
    CATALOGS_KEY = 'catalogs'

    def entry_id(catalog, name):
        return '{}-{}'.format(catalog, name)

    def entry_key(id=None, name=None, catalog=None):
        if id:
            return 'catalog_entry_{}'.format(id)
        elif name and catalog:
            return Catalogs.entry_key(id=Catalogs.entry_id(catalog, name))
        else:
            raise RuntimeError("Need catalog and id")

    def catalog_key(catalog_name):
        return 'catalog_{}'.format(catalog_name)

    def lookup(self, catalog_name, entry_name):
        entry_key = Catalogs.entry_key(catalog=catalog_name, name=entry_name)
        logger.debug('Looking up for %s on catalog %s with Redis key %s', entry_name, catalog_name, entry_key)
        entry =  self.__decorate_entry(redis_client.dict_get(entry_key))
        if not entry:
            raise NotFoundError('Object with name {} from catalog {} not found'.format(entry_name, catalog_name))
        return entry

    def __decorate_entry(self, entry):
        if entry:
            entry['raj2000'] = float(entry['raj2000'])
            entry['dej2000'] = float(entry['dej2000'])
            entry_coords = SkyCoord(entry['raj2000'], entry['dej2000'], unit='deg')
            entry['ra_hms'] = entry_coords.ra.to_string(sep=':', unit=u.hourangle, fields=3)
            entry['dec_dms'] = entry_coords.dec.to_string(sep=':', unit=u.degree, fields=3)
        return entry
        

catalogs = Catalogs()
