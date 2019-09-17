import functools
from app import logger

class Marker:
    def __init__(self, ra, dec, frame):
        self.ra = ra
        self.dec = dec
        self.x, self.y = frame.get_xy(ra, dec)

    def within_box(self):
        return 0 <= self.x <= 1 and 0 <= self.y <= 1

    def circle(self, svg, radius, label=None, marker_opts={}, label_opts={}):
        svg.circle(self.x, self.y, radius, **marker_opts)
        self.__add_label(label, svg, offset=radius, **label_opts)

    def __add_label(self, label, svg, offset=0, **kwargs):
        if label:
            if self.x < 0.8:
                svg.text(self.x + svg.from_pixels(5 + offset), self.y, label, **kwargs)
            else:
                text = svg.text(self.x - svg.from_pixels(5 + offset), self.y, label, add=False, **kwargs)
                text['text-anchor'] = 'end'
                svg.add(text)
