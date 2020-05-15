import astropy.units as u
import astropy.wcs
from astropy.coordinates import SkyCoord
from .astropy_monkeypatch import astropy_monkeypatch
import healpy
import math
from app import logger


class SkyFrame:
    def __init__(self, ra, dec, fov, nside=128):
        self.nside = nside
        self.skycoord = SkyCoord(ra, dec)
        self.fov = fov
        self.circle_fov = self.fov * math.sqrt(2)
        self.__build_wcs()
        self.__build_bounding_box()


    def get_healpix_disk(self):
        center_xyz = healpy.ang2vec(self.skycoord.ra.deg, self.skycoord.dec.deg, lonlat=True)
        return healpy.query_disc(self.nside, center_xyz, (self.circle_fov/2.0).to(u.rad).value, nest=True)

    def get_xy(self, ra, dec):
        c = SkyCoord(ra, dec)
        x, y = astropy.wcs.utils.skycoord_to_pixel(c, self.w)
        x = (x - self.min_x) / (self.max_x - self.min_x)
        y = (y - self.min_y) / (self.max_y - self.min_y)
        return 1 - x, 1 - y

    def get_degs2pix(self, degrees):
        degrees = degrees * u.deg
        result = degrees / self.fov
        logger.debug('degs2pix: {}, fov={}, result={}'.format(degrees, self.fov, result))
        return result.value


    def __build_wcs(self):
        projection='CAR'
        self.w = astropy.wcs.WCS(naxis=2)
        self.w.wcs.ctype = ['RA---{}'.format(projection), 'DEC--{}'.format(projection)]
        self.w.wcs.crval = [self.skycoord.ra.deg, self.skycoord.dec.deg]
        self.w.wcs.crpix = [0, 0]

    def __build_bounding_box(self):
        bounding_box = [self.skycoord.directional_offset_by(position_angle=degs * u.deg, separation = self.circle_fov/2) for degs in [0, 90, 180, 270]]
        bounding_box = [astropy.wcs.utils.skycoord_to_pixel(c, self.w) for c in bounding_box]

        x_coords = [c[0] for c in bounding_box]
        y_coords = [c[1] for c in bounding_box]
        projection_radius = (max(x_coords) - min(x_coords) ) / 2
        projection_square_side = math.sqrt(2) * projection_radius
        projection_center_x, projection_center_y = min(x_coords) + (max(x_coords) - min(x_coords))/2, min(y_coords) + (max(y_coords) - min(y_coords))/2 
        self.min_x, self.max_x = projection_center_x - projection_square_side/2, projection_center_x + projection_square_side/2
        self.min_y, self.max_y = projection_center_y - projection_square_side/2, projection_center_y + projection_square_side/2


