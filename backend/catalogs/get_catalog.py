from astroquery.vizier import Vizier
from astroquery.simbad import Simbad
import astropy.units as u
from astropy.coordinates import SkyCoord
import json


class CatalogEntry:
    def get_id(catalog, name):
        return '{}-{}'.format(catalog, name)

    def __init__(self, catalog, name, raj2000=None, dej2000=None, parent_entry=None):
        self.id = CatalogEntry.get_id(catalog, name)
        self.catalog = catalog
        self.name = name
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
    def __init__(self):
        self.vizier = Vizier(columns=['*', '_RAJ2000', '_DEJ2000'], row_limit=-1)

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
        for _, item in ngc_ic.items():
            item.catalog, item.name = get_catalog_and_name(item.name)
            item.id = CatalogEntry.get_id(item.catalog, item.name)
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
                ngc_ic_id = CatalogEntry.get_id('ngc/ic', ngc_ic_name)
                entry = CatalogEntry('common_names', object_name, parent_entry=ngc_ic[ngc_ic_id])
            else:
                simbad_entry = Simbad.query_object(object_name)
                coords = SkyCoord(simbad_entry['RA'].data[0], simbad_entry['DEC'].data[0], unit=(u.hourangle, u.deg))
                entry = CatalogEntry('column_names', object_name, raj2000=coords.ra.degree, dej2000=coords.dec.degree)
        print(ngc)
        print(ic)


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

importer = CatalogVizierImporter()
importer.import_ngc_ic()
