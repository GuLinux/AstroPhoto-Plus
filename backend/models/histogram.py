from astropy.io import fits


class Histogram:
    def __init__(self, fits_file):
        self.fits_file = fits_file
