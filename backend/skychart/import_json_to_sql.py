import healpy
import sqlite3
import json

con = sqlite3.connect("stars.db")
con.row_factory = sqlite3.Row

cur = con.cursor()
cur.execute('DROP TABLE IF EXISTS stars')
create_table_stmt = 'CREATE TABLE stars (ra real, dec real, mag real, hipparcos integer, hd integer, tycho text, bayer text, constellation text, flamsteed text, names text, healpix_128 integer)'
cur.execute(create_table_stmt)

with open('stars.json') as j:
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

