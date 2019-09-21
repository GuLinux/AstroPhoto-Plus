import astropy.units as u
from .marker import Marker
from app import logger

MAGNITUDE_MIN_AREA = 0.5
MAGNITUDE_MAX_AREA = 7
MAGNITUDE_AREA_RANGE = MAGNITUDE_MAX_AREA - MAGNITUDE_MIN_AREA

class Star:
    def __init__(self, star_db_object, frame):
        self.ra = star_db_object['ra'] * u.deg
        self.dec = star_db_object['dec'] * u.deg
        self.magnitude = star_db_object['mag']
        self.marker = Marker(self.ra, self.dec, frame)
        self.constellation = star_db_object['constellation']
        self.names = [name.strip() for name in star_db_object['names'].split(';') if name.strip()]
        self.bayer = star_db_object['bayer']

    def draw(self, magnitude_range, svg, draw_label=False, color='black'):
        label = self.label() if draw_label else None
        area = (self.magnitude - magnitude_range[0]) / (magnitude_range[1] - magnitude_range[0])
        area = MAGNITUDE_MIN_AREA + (area * MAGNITUDE_AREA_RANGE )
        area = MAGNITUDE_MAX_AREA - area
        self.marker.circle(svg, area, marker_opts={'stroke': color, 'fill': color})
        self.marker.add_label(svg, label, offset=area, label_opts={'fill': color})

    def label(self):
        if self.names:
            first_name = self.names[0]
            if '(' in first_name:
                first_name = first_name.split('(')[0].strip()
            return first_name
        if self.bayer:
            return '{} {}'.format(self.bayer, self.constellation)
        return None


    def __str__(self):
        return 'ra={}, dec={}, magnitude={}, names={}, constellation={}, bayer={}'.format(self.ra, self.dec, self.magnitude, self.names, self.constellation, self.bayer)
    
    def __repr__(self):
        return self.__str__()
