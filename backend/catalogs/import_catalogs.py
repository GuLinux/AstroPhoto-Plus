from astroquery.vizier import Vizier
from astroquery.simbad import Simbad
import astropy.units as u
from astropy.coordinates import SkyCoord
import json
from app import logger
from redis_client import redis_client
from errors import BadRequestError
from .catalogs import Catalogs

class CatalogEntry:
    def __init__(self, catalog, name, raj2000=None, dej2000=None, parent_entry=None):
        self.id = Catalogs.entry_id(catalog, name)
        self.catalog = catalog
        self.name = name.strip()
        if raj2000 is not None and dej2000 is not None:
            self.raj2000 = raj2000
            self.dej2000 = dej2000
        elif parent_entry:
            self.raj2000 = parent_entry.raj2000
            self.dej2000 = parent_entry.dej2000
        else:
            raise RuntimeError('You need to specify either a parent entry or coordinates ({}, {})'.format(catalog, name))


    def to_map(self):
        return {
                'id': self.id,
                'catalog': self.catalog,
                'name': self.name,
                'raj2000': self.raj2000,
                'dej2000': self.dej2000,
        }

    def __str__(self):
        return str(self.to_map())

    def __repr__(self):
        return self.__str__()

class CatalogVizierImporter:
    IC_OBJECTS_COUNT = 5386
    NGC_OBJECTS_COUNT = 13226 - IC_OBJECTS_COUNT
    MESSIER_OBJECTS_COUNT = 110
    COMMON_NAMES_OBJECT_COUNT = 197 # TODO: it should be 227, but there are duplicates. How to handle them?
    def __init__(self):
        self.vizier = Vizier(columns=['*', '_RAJ2000', '_DEJ2000'], row_limit=-1)

    def available_catalogs(self):
        return {
            'ngc_ic': {
                'display_name': 'NGC/IC, Messier and Common Names',
                'provides': ['NGC', 'IC', 'M', 'common_names'],
            },
        }

    def import_catalog(self, name):
        if name == 'ngc_ic':
            return self.import_ngc_ic()
        raise BadRequestError('Catalog {} not supported'.format(name))

    def import_ngc_ic(self):
        def get_catalog_and_name(object_name):
            if object_name.startswith('I '):
                return 'IC', object_name[2:]
            elif object_name.startswith('I'):
                return 'IC', object_name[1:]
            return 'NGC', object_name

        catalogs = self.vizier.get_catalogs('VII/118')
        ngc_ic = self.__import_catalog('ngc/ic', catalogs[0])
        ngc = {}
        ic = {}
        common_names = {}
        messier = {}

        for _, item in ngc_ic.items():
            item.catalog, item.name = get_catalog_and_name(item.name)
            item.id = Catalogs.entry_id(item.catalog, item.name)
            if item.catalog == 'NGC':
                ngc[item.id] = item
            else:
                ic[item.id] = item

        viz_common_names = catalogs[1]
        for value in viz_common_names:
            ngc_ic_name = value['Name']
            object_name = value['Object']
            entry = None
            if ngc_ic_name:
                catalog, name = get_catalog_and_name(ngc_ic_name)
                ngc_ic_id = Catalogs.entry_id('ngc/ic', ngc_ic_name)
                entry = CatalogEntry('common_names', object_name, parent_entry=ngc_ic[ngc_ic_id])
            else:
                simbad_entry = Simbad.query_object(object_name)
                coords = SkyCoord(simbad_entry['RA'].data[0], simbad_entry['DEC'].data[0], unit=(u.hourangle, u.deg))
                entry = CatalogEntry('column_names', object_name, raj2000=coords.ra.degree, dej2000=coords.dec.degree)
            common_names[entry.id] = entry
            if entry.name.startswith('M '):
                messier_number = entry.name.split(' ')[-1]
                messier_entry = CatalogEntry('M', messier_number, parent_entry=entry)
                messier[messier_entry.id] = messier_entry
        self.__add_catalog('NGC', 'NGC', ngc, CatalogVizierImporter.NGC_OBJECTS_COUNT)
        self.__add_catalog('IC', 'IC', ic, CatalogVizierImporter.IC_OBJECTS_COUNT)
        self.__add_catalog('M', 'Messier', messier, CatalogVizierImporter.MESSIER_OBJECTS_COUNT)
        self.__add_catalog('common_names', 'Common Names', common_names, CatalogVizierImporter.COMMON_NAMES_OBJECT_COUNT)
        return {
            'NGC': len(ngc),
            'IC': len(ic),
            'M': len(messier),
            'common_names': len(common_names),
        }

    def __add_catalog(self, catalog_name, catalog_display_name, items, expected_length):
        if expected_length == len(items):
            logger.debug('Importing %s catalog with %d items to Redis', catalog_name, len(items))
            current_catalogs = redis_client.dict_get(Catalogs.CATALOGS_KEY)
            current_catalogs.update({ catalog_name: json.dumps({ 'display_name': catalog_display_name, 'items': len(items)}) })
            redis_client.dict_set('catalogs', current_catalogs)
            for _, item in items.items():
    #            logger.debug('Adding entry %s [%s] to catalog %s', item.name, item.id, catalog_name)
                redis_client.dict_set(Catalogs.catalog_key(catalog_name), { item.name: item.id })
                redis_client.dict_set(Catalogs.entry_key(id=item.id), item.to_map())
        else:
            logger.warning('Skipping import for catalog %s: expected items: %d, was %d', catalog_name, expected_length, len(items))


    def __import_catalog(self, catalog_name, catalog, id_column=None):
        if id_column is None:
            for column_name in catalog.columns:
                column = catalog.columns[column_name]
                if 'ucd' in column.meta and column.meta['ucd'] == 'ID_MAIN':
                    id_column = column.name
                    break
        if not id_column:
            raise RuntimeError('No ID column was specified and none was automatically found')
        imported_catalog = {}
        for value in catalog:
            entry = CatalogEntry(catalog_name, str(value[id_column]), raj2000=float(value['_RAJ2000']), dej2000=float(value['_DEJ2000']))
            imported_catalog[entry.id] = entry
        return imported_catalog

#importer = CatalogVizierImporter()
#importer.import_ngc_ic()

catalog_importer = CatalogVizierImporter()
