from app import logger
from redis_client import redis_client
import astropy.units as u
from astropy.coordinates import SkyCoord
from errors import NotFoundError
import json
from astroquery.simbad import Simbad

Simbad.add_votable_fields('ra(d)')
Simbad.add_votable_fields('dec(d)')
Simbad.add_votable_fields('ids')

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

    def all(self):
        all_catalogs = redis_client.dict_get('catalogs')
        for key, catalog in all_catalogs.items():
            all_catalogs[key] = json.loads(catalog)
        all_catalogs['SIMBAD'] = { 'display_name': 'Simbad search', 'type': 'search_service' }
        return all_catalogs

    def lookup(self, catalog_name, entry_name):
        if catalog_name == 'SIMBAD':
            return self.simbad_lookup(entry_name)
        entry_key = Catalogs.entry_key(catalog=catalog_name, name=entry_name)
        logger.debug('Looking up for %s on catalog %s with Redis key %s', entry_name, catalog_name, entry_key)
        entry =  self.__decorate_entry(redis_client.dict_get(entry_key))
        if not entry:
            raise NotFoundError('Object with name {} from catalog {} not found'.format(entry_name, catalog_name))
        return [entry]

    def simbad_lookup(self, entry_name):
        def sanitize_name(name):
            name_entries = [x for x in name.split(' ') if x]
            cat = name_entries[0] if len(name_entries) > 1 else 'N/A'
            if name_entries[0].startswith('MCG'):
                cat = 'MCG'
            if cat == 'NAME':
                name_entries = name_entries[1:]
            return cat, ' '.join(name_entries) 


        simbad_objects = Simbad.query_object(entry_name)
        if not simbad_objects:
            raise NotFoundError('Object with name {} not found in SIMBAD'.format(entry_name))
        results = []
        for simbad_object in simbad_objects:
            coordinates = SkyCoord(ra=simbad_object['RA_d'] * u.deg, dec=simbad_object['DEC_d'] * u.deg, equinox='J2000')
            object_id = simbad_object['MAIN_ID'].decode()

            catalog, object_name = sanitize_name(object_id)
            object_names = [sanitize_name(x) for x in simbad_object['IDS'].decode().split('|') if x != object_id]
            object_names = [{'catalog': catalog, 'name': name} for catalog, name in object_names]

            results.append(self.__decorate_entry({
                'raj2000': coordinates.ra.deg,
                'dej2000': coordinates.dec.deg,
                'displayName': object_name,
                'objectNames': object_names,
                'catalog': catalog,
                'id': object_id,
            }))
        return results

    def __decorate_entry(self, entry):
        if entry:
            entry['raj2000'] = float(entry['raj2000'])
            entry['dej2000'] = float(entry['dej2000'])
            entry_coords = SkyCoord(entry['raj2000'], entry['dej2000'], unit='deg')
            entry['ra_hms'] = entry_coords.ra.to_string(sep=':', unit=u.hourangle, fields=3)
            entry['dec_dms'] = entry_coords.dec.to_string(sep=':', unit=u.degree, fields=3)
        return entry


        

catalogs = Catalogs()
