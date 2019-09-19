import healpy
import sqlite3
import json
import sys
import os
import gzip

if len(sys.argv) < 2 or not os.path.exists(sys.argv[1]):
    raise RuntimeError('Usage: {} file.json'.format(sys.argv[0]))

con = sqlite3.connect("stars.db")
con.row_factory = sqlite3.Row

cur = con.cursor()
#cur.execute('DROP TABLE IF EXISTS stars')
create_table_stmt = 'CREATE TABLE IF NOT EXISTS stars (ra real, dec real, mag real, hipparcos integer, hd integer, tycho text, bayer text, constellation text, flamsteed text, names text, healpix_128 integer)'
cur.execute(create_table_stmt)

filename = sys.argv[1]
stars = {}

if filename.endswith('.gz'):
    with gzip.open(filename) as j:
        stars = json.load(j)
else:
    with open(filename) as j:
        stars = json.load(j)

for star in stars.values():
    cur.execute('INSERT INTO stars (ra, dec, mag, hipparcos, hd, tycho, bayer, constellation, flamsteed, names, healpix_128) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', (
        star['RA'],
        star['DEC'],
        star['mag'],
        star.get('HIP'),
        star.get('HD'),
        star.get('TYC'),
        star.get('Bayer'),
        star.get('Constellation'),
        star.get('Flamsteed'),
        ';'.join(star.get('names', [])),
        int(healpy.ang2pix(128, star['RA'], star['DEC'], nest=True, lonlat=True))
    ))
con.commit()
con.close()

