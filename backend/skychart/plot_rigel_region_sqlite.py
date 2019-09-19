import healpy
import astropy.units as u
from astropy.coordinates import SkyCoord
import astropy.wcs
import svgwrite
import sys

import sqlite3
import numpy as np
import time
import math
import numpy as np
import matplotlib.pyplot as plt



#con = sqlite3.connect("kstars_healpix.db")
con = sqlite3.connect("stars.db")
con.row_factory = sqlite3.Row

cur = con.cursor()
#star_name = 'Deneb Cygni'
star_name = 'Alnilam'
magnitude_limit = 9
radius = 25
max_labels = 15
max_labels_magnitude = 5

#star_name = 'Rigel'
cur.execute("select ra, dec, healpix_128 from stars where names LIKE '%{}%'".format(star_name))
ref_star = cur.fetchone()
ref_star_coords = SkyCoord(ra=ref_star['ra'], dec=ref_star['dec'], unit=(u.deg, u.deg))

print('Star coordinates: {}, healpix: {}'.format(ref_star_coords.to_string('hmsdms'), ref_star['healpix_128'] ))
bounding_box = [ref_star_coords.directional_offset_by(position_angle=degs * u.deg, separation = radius * u.deg) for degs in [0, 90, 180, 270]]
print(bounding_box)


ref_star_xyz = healpy.ang2vec(ref_star['ra'], ref_star['dec'], lonlat=True)

projection='CAR'
w = astropy.wcs.WCS(naxis=2)

w.wcs.ctype = ['RA---{}'.format(projection), 'DEC--{}'.format(projection)]
w.wcs.crval = [ref_star['ra'], ref_star['dec']]
w.wcs.crpix = [500, 500]
#w.wcs.cdelt = np.array([0.01, 0.01])

bounding_box = [astropy.wcs.utils.skycoord_to_pixel(c, w) for c in bounding_box]
x_coords = [c[0] for c in bounding_box]
y_coords = [c[1] for c in bounding_box]
projection_radius = (max(x_coords) - min(x_coords) ) / 2
projection_square_side = math.sqrt(2) * projection_radius
projection_center_x, projection_center_y = min(x_coords) + (max(x_coords) - min(x_coords))/2, min(y_coords) + (max(y_coords) - min(y_coords))/2 
min_x, max_x, min_y, max_y = projection_center_x - projection_square_side/2, projection_center_x + projection_square_side/2, projection_center_y - projection_square_side/2, projection_center_y + projection_square_side/2




def get_xy_from_coords(ra, dec, units=(u.deg, u.deg)):
    c = SkyCoord(ra, dec, unit=units)
    x, y = astropy.wcs.utils.skycoord_to_pixel(c, w)
    x = (x - min_x) / (max_x - min_x)
    y = (y - min_y) / (max_y - min_y)
    return 1 - x, 1 - y

def fetch_star(cursor, stars):
    star = cursor.fetchone()
    if not star:
        return None
    star = dict(star)
    star['x'], star['y'] = get_xy_from_coords(star['ra'], star['dec'])

    if 0 <= star['x'] <= 1 and 0 <= star['y'] <= 1:
        stars.append(star)
    return True


def fetch_stars(nside):
    ref_star_disk = healpy.query_disc(nside, ref_star_xyz, np.deg2rad(radius), nest=True)
    cur = con.cursor()
    #query = 'select * from stars where mag < 5'.format(', '.join(['{}'.format(int(n)) for n in ref_star_disk]))
    query = 'select * from stars where healpix_128 in ({}) AND mag <= {}'.format(', '.join(['{}'.format(int(n)) for n in ref_star_disk]), magnitude_limit)
    # print(query)
    cur.execute(query)
    stars = []
    while fetch_star(cur, stars):
        pass
    return stars

def get_label(star):
    if star.get('names', []):
        first_name = star['names'].split(';')[0]
        if '(' in first_name:
            first_name = first_name.split('(')[0].strip()
        return first_name
    if star.get('bayer'):
        return '{} {}'.format(star['bayer'], star['constellation'])
    return ''


start = time.time()
nside = 128
stars = fetch_stars(nside)
stars.sort(key=lambda star: star['mag'])
print('length after filtering with nside={}: len(stars)={}'.format(nside, len(stars)))
print('elapsed: {}'.format(time.time() - start))

min_mag, max_mag = stars[0]['mag'], stars[-1]['mag']
mag_range = max_mag - min_mag
mag_area_min, mag_area_max = 1, 5
mag_area_range = mag_area_max - mag_area_min

drawn_labels = 0
drawing_size = 1024
dwg = svgwrite.Drawing(filename='plot.svg', size=(drawing_size, drawing_size))
for star in stars:
    area = (star['mag'] - min_mag) / mag_range
    area = mag_area_min + (area * mag_area_range)
    area = mag_area_max - area
    x, y = star['x'] * drawing_size, star['y'] * drawing_size
    dwg.add(dwg.circle(center=(x, y), r=area))
    if drawn_labels < max_labels and star['mag'] <= max_labels_magnitude:
        dwg.add(dwg.text(get_label(star), insert=(x+5, y) ))
        drawn_labels += 1
dwg.save()
sys.exit(0)

def mag2area(mag, min_mag, max_mag):
    mag_range = max_mag - min_mag
    m_score = (max_mag - mag) / mag_range
    diam_range = 1
    return diam_range * math.pow(0.5 + m_score * diam_range, 2)




magnitudes = [star['mag'] for star in stars]
min_mag, max_mag = min(magnitudes), max(magnitudes)




ras, decs, areas, stars_labels = [], [], [], []


def get_label(star):
    if star['names']:
        names = star['names'].split(';')
        if names:
            return names[0]
    if star['bayer'] and star['constellation']:
        return '{} {}'.format(star['bayer'], star['constellation'])
    return None


save_csv = False
with open('stars.csv', 'w') as f:
    for star in stars:
        wcs_ra, wcs_dec = star['x'], star['y']
        ras.append(wcs_ra)
        decs.append(wcs_dec)
        areas.append(mag2area(star['mag'], min_mag, max_mag))
        stars_labels.append(dict(star))
        if save_csv:

            print('Coords for {}: {}, {}'.format(star.get('names', '{} {}'.format(star.get('bayer'), star.get('constellation'))), wcs_ra, wcs_dec))
           #print('ra: {}, dec: {}, mag: {}, lon: {}, lat: {}, area: {}'.format(star['ra'], star['dec'], star['mag'], ras[-1], decs[-1], areas[-1]))
            f.write('{},{},{},{}\n'.format(star['ra']/15.0, star['dec'], star['mag'], get_label(star)))

#print(stars_labels)

# projection = cartopy.crs.AzimuthalEquidistant(central_longitude=get_ra(ref_star['ra']), central_latitude=get_dec(ref_star['dec']))
ax = plt.axes(projection=w)
# #ax.stock_img()
# #ax.set_xlim(0, 360)
#  
ax.axis('equal')
ax.scatter(ras, decs, s=areas, color='black')
# # plt.title("Aitoff")
# ax.gridlines()
plt.grid(True)

plt.gca().invert_xaxis()
plt.savefig('plt.jpg', dpi=500)
