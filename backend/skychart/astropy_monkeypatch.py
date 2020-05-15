from astropy.coordinates import SkyCoord, Angle
import astropy.units as u
import numpy as np
from astropy.coordinates.representation import (SphericalRepresentation, UnitSphericalRepresentation, SphericalDifferential)

# The following code is backported directly from AstroPy:
#  - https://github.com/astropy/astropy/blob/b6b412354bb37e8b436c99130a1d1a8fedb75aa3/astropy/coordinates/sky_coordinate.py
#  - https://github.com/astropy/astropy/blob/b6b412354bb37e8b436c99130a1d1a8fedb75aa3/astropy/coordinates/angle_utilities.py

astropy_monkeypatch = False

if not hasattr(SkyCoord, 'directional_offset_by'):
    def offset_by(lon, lat, posang, distance):
        cos_a = np.cos(distance)
        sin_a = np.sin(distance)
        cos_c = np.sin(lat)
        sin_c = np.cos(lat)
        cos_B = np.cos(posang)
        sin_B = np.sin(posang)

        cos_b = cos_c * cos_a + sin_c * sin_a * cos_B
        xsin_A = sin_a * sin_B * sin_c
        xcos_A = cos_a - cos_b * cos_c

        A = Angle(np.arctan2(xsin_A, xcos_A), u.radian)
        small_sin_c = sin_c < 1e-12
        if small_sin_c.any():
            A_pole = (90*u.deg + cos_c*(90*u.deg-Angle(posang, u.radian))).to(u.rad)
            if A.shape:
                small_sin_c = np.broadcast_to(small_sin_c, A.shape)
                A[small_sin_c] = A_pole[small_sin_c]
            else:
                A = A_pole

        outlon = (Angle(lon, u.radian) + A).wrap_at(360.0*u.deg).to(u.deg)
        outlat = Angle(np.arcsin(cos_b), u.radian).to(u.deg)

        return outlon, outlat

    def directional_offset_by(self, position_angle, separation):
        slat = self.represent_as(UnitSphericalRepresentation).lat
        slon = self.represent_as(UnitSphericalRepresentation).lon

        newlon, newlat = offset_by(
            lon=slon, lat=slat,
            posang=position_angle, distance=separation)

        return SkyCoord(newlon, newlat, frame=self.frame)

    SkyCoord.directional_offset_by = directional_offset_by

    astropy_monkeypatch = True


