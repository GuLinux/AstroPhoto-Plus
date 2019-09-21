import os
from errors import BadRequestError
from app import logger
import sqlite3
import json

import healpy
import astropy.units as u
from astropy.coordinates import SkyCoord

import svgwrite

from .skyframe import SkyFrame
from .marker import Marker
from .star import Star
from .svg import SVG



SQLITE_PATH = os.path.join( os.path.dirname(__file__), 'stars.db' )

class SkyChart:
    def __init__(self):
        pass

    def chart(self, options):
        try:
            ra = float(options['ra']) * u.hourangle
            dec = float(options['dec']) * u.deg
            fov = float(options['fov']) * u.deg
        except KeyError as e:
            raise BadRequestError('Missing parameter: {}'.format(e.args[0]))

        magnitude = float(options.get('mag', '6'))
        max_labels_magnitude = float(options.get('max_labels_mag', 6))
        max_labels = int(options.get('max_labels', 10))
        image_size = int(options.get('size', '800'))
        markers = options.get('markers', [])
        background_color = options.get('bg_color')
        stars_color = options.get('stars_color', 'black')

        logger.debug('StarChart: ra={}, dec={}, fov={}, magnitude={}, max_labels_magnitude={}, max_labels={}, size={}'.format(ra, dec, fov, magnitude, max_labels_magnitude, max_labels, image_size))
        logger.debug('markers: {}'.format(markers))

        sqlite_connection = sqlite3.connect(SQLITE_PATH)
        sqlite_connection.row_factory = sqlite3.Row
        cursor = sqlite_connection.cursor()
        frame = SkyFrame(ra, dec, fov)
        query = 'select * from stars where healpix_128 in ({}) AND mag <= {}'.format(', '.join(['{}'.format(int(n)) for n in frame.get_healpix_disk()]), magnitude)
        cursor.execute(query)
        stars = []
        self.__populate_stars(cursor, frame, stars)
        magnitude_range = stars[0].magnitude, stars[-1].magnitude

        svg = SVG(image_size)
        if background_color:
            svg.rect(0, 0, 1, 1, stroke=background_color, fill=background_color)
        drawn_labels = 0
        for star in stars:
            draw_label = drawn_labels < max_labels and star.magnitude <= max_labels_magnitude
            star.draw(magnitude_range, svg, draw_label=draw_label, color=stars_color)
            if draw_label:
                drawn_labels += 1
        for marker in markers:
            svg_marker = Marker(marker['ra'] * u.hourangle, marker['dec'] * u.deg, frame)
            svg_marker.draw(svg, marker)

        return svg.dwg.tostring()

    def __populate_stars(self, cursor, frame, stars):
        for row in cursor:
            star = Star(row, frame)
            if star.marker.within_box():
                stars.append(star)
        stars.sort(key=lambda star: star.magnitude)




skychart = SkyChart()


