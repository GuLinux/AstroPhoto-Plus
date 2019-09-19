from astroquery.vizier import Vizier
import json

common_names_cat = 'IV/27A/table3'
hd_dm_gc_hr_hip_bayer_flamsteed_cross_cat = 'IV/27A/catalog'
hip_cat = 'I/239/hip_main'
tyc_cat = 'I/239/tyc_main'


v = Vizier(columns=['_RAJ2000', '_DEJ2000','B-V', 'Vmag', 'HIP', 'HD', '*'], row_limit=-1)

common_names = {}
common_names_viz = v.get_catalogs(common_names_cat)[0]
print('Importing common star names')
for star in common_names_viz:
    hd_num = int(star['HD'])
    names = [name.strip() for name in star['Name'].split(';')]
    if hd_num in common_names:
        common_names[hd_num]['names'].extend(names)
    else:
        common_names[hd_num] = {
            'HD': hd_num,
            'BFD': star['BFD'],
            'names': names,
        }

print('Importing cross reference')
cross_ref = {}
cross_ref_viz = v.get_catalogs(hd_dm_gc_hr_hip_bayer_flamsteed_cross_cat)[0]
for star in cross_ref_viz:
    if star['HD']:
        cross_ref[int(star['HD'])] = {
            'HD': int(star['HD']),
            'HIP': int(star['HIP']) if star['HIP'] else None,
            'Bayer': str(star['Bayer']) if star['Bayer'] else None,
            'Constellation': str(star['Cst']) if star['Cst'] else None,
            'Flamsteed': str(star['Fl']) if star['Fl'] else None,
            'RA': float(star['_RAJ2000']),
            'DEC': float(star['_DEJ2000']),
            'mag': float(star['Vmag']),
        }
    else:
        print('Star missing HD number: {}'.format(star))

print('Importing HIP')
hip = {}
hip_viz = v.get_catalogs(hip_cat)[0]
for star in hip_viz:
    if star['_RAJ2000'] and star['_DEJ2000'] and star['Vmag']:
        hip[int(star['HIP'])] = {
            'RA': float(star['_RAJ2000']),
            'DEC': float(star['_DEJ2000']),
            'mag': float(star['Vmag']),
            'HD': int(star['HD']) if star['HD'] else None,
            'HIP': int(star['HIP']),
        }
    else:
        print('Skipping star: {}'.format(star['HIP']))

print('Importing TYC')
tyc = {}
tyc_viz = v.get_catalogs(tyc_cat)[0]
for star in tyc_viz:
    if star['_RAJ2000'] and star['_DEJ2000'] and star['Vmag']:
        tyc[str(star['TYC'])] = {
            'RA': float(star['_RAJ2000']),
            'DEC': float(star['_DEJ2000']),
            'TYC': str(star['TYC']),
            'HIP': int(star['HIP']) if star['HIP'] else None,
            'HD': int(star['HD']) if star['HD'] else None,
            'mag': float(star['Vmag']),
        }
    else:
        print('Skipping star: {}'.format(star['TYC']))

print('Merging objects')
stars = {}
hd_cross = {}

print('Merging HIP stars')
for id, star in hip.items():
    hip_id = 'HIP_{}'.format(id)
    stars[hip_id] = star
    if star['HD']:
        hd_cross[star['HD']] = hip_id

print('Merging TYC stars')
for id, star in tyc.items():
    if star['HIP']:
        stars['HIP_{}'.format(star['HIP'])]['TYC'] = id
    else:
        tyc_id = 'TYC_{}'.format(id)
        stars[tyc_id] = star
        if star['HD']:
            hd_cross[star['HD']] = tyc_id

print('Merging cross references')
for id, star in cross_ref.items():
    dict_update = dict([(k, v) for k, v in star.items() if k in ['Bayer', 'Constellation', 'Flamsteed', 'HD']])
    if star['HD'] in hd_cross:
        star_id = hd_cross[star['HD']]
        stars[star_id].update(dict_update)
    else:
        star_id = 'HD_{}'.format(star['HD'])
        stars[star_id] = star
        hd_cross[star['HD']] = star_id


for hd, star in common_names.items():
    star_id = hd_cross[hd]
    stars[star_id]['names'] = star['names']

with open('stars.json', 'w') as j:
    json.dump(stars, j)


