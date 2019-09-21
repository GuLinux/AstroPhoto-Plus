import svgwrite
from app import logger
import functools

def svg_element(f):
    @functools.wraps(f)
    def wrapped(self, *args, add=True, **kwargs):
        element = f(self, *args, **kwargs)
        if add:
            self.add(element)
        return element
    return wrapped

class SVG:
    def __init__(self, size=500):
        self.size = size
        self.dwg = svgwrite.Drawing(size=('100%', '100%'))
        self.dwg.viewbox(0, 0, size, size)

    @svg_element
    def rect(self, x, y, width, height, rotate=None, *args, **kwargs):
        x, y = self.get_pixels(x), self.get_pixels(y)
        rect = self.dwg.rect(insert=(x, y), size=(self.get_pixels(width), self.get_pixels(height)), *args, **kwargs)
        if rotate:
            degs, center_x, center_y = rotate
            rect.rotate(degs, center=(self.get_pixels(center_x), self.get_pixels(center_y)))
        return rect

    @svg_element
    def circle(self, x, y, radius, *args, **kwargs):
        return self.dwg.circle(center=(self.get_pixels(x), self.get_pixels(y)), r=self.get_pixels(radius), *args, **kwargs)

    @svg_element
    def text(self, x, y, text, *args, **kwargs):
        return self.dwg.text(text, insert=(self.get_pixels(x), self.get_pixels(y)), *args, **kwargs)

    def get_pixels(self, size):
        return size * self.size

    def from_pixels(self, size):
        return size / self.size

    def add(self, *args, **kwargs):
        self.dwg.add(*args, **kwargs)

    def __add(self, element, add):
        if add:
            self.add(element)
        return element
