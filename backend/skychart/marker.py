import functools
from app import logger

class Marker:
    def __init__(self, ra, dec, frame):
        self.ra = ra
        self.dec = dec
        self.frame = frame
        self.x, self.y = frame.get_xy(ra, dec)

    def within_box(self):
        return 0 <= self.x <= 1 and 0 <= self.y <= 1

    def draw(self, svg, options):
        logger.debug(options)
        marker_opts = options.get('marker_opts', {})
        label_opts = options.get('label_opts', {})
        shape = options.get('shape', 'circle')
        label = options.get('label')
        label_offset = options.get('label_offset', 5)
        unit = options.get('unit', 'pixel')
        if shape == 'circle':
            self.circle(svg, options['radius'], marker_opts=marker_opts, unit=unit)

        if shape == 'rect':
            self.rect(svg, options['width'], options['height'], marker_opts=marker_opts, unit=unit, rotate=options.get('rotate', 0))

        self.add_label(svg, label, offset=label_offset, label_opts=label_opts)

    def circle(self, svg, radius, marker_opts={}, unit='pixel'):
        if unit == 'pixel':
            radius = svg.from_pixels(radius)
        elif unit == 'deg':
            radius = self.frame.get_degs2pix(float(radius))

        svg.circle(self.x, self.y, radius, **marker_opts)

    def rect(self, svg, width, height, marker_opts={}, unit='pixel', rotate=None):
        if unit == 'pixel':
            width = svg.from_pixels(width)
            height = svg.from_pixels(height)
        elif unit == 'deg':
            width = self.frame.get_degs2pix(float(width))
            height = self.frame.get_degs2pix(float(height))
        if rotate:
            rotate = rotate, self.x, self.y
        rect = svg.rect(self.x - width/2, self.y - height/2, width, height, rotate, **marker_opts)

    def add_label(self, svg, label, label_opts={}, offset=5):
        if label:
            if self.x < 0.8:
                svg.text(self.x + svg.from_pixels(5 + offset), self.y, label, **label_opts)
            else:
                text = svg.text(self.x - svg.from_pixels(5 + offset), self.y, label, add=False, **label_opts)
                text['text-anchor'] = 'end'
                svg.add(text)
