import astropy.units as u
from astropy.coordinates import Angle, SkyCoord
import astropy.wcs
import math
import sys

solutions = [
    { 'ra': '12h28m18.70s', 'dec': '85d41m28.22s', 'orientation': -44.538300 },
    { 'ra': '11h59m30.36s', 'dec': '86d9m54.04s', 'orientation': 98.62 },
    { 'ra': '12h13m47.94s', 'dec': '85d38m39.60s', 'orientation': -0.474926 },
]

mount_center_star = SkyCoord('12h18m22.91s 86d00m09.1s')
mount_center = mount_center_star.directional_offset_by(Angle('20h20m06.08s'), Angle('00d00m00.3s'))

projection='SIN'
if len(sys.argv) > 1:
    projection = sys.argv[1]
w = astropy.wcs.WCS(naxis=2)
w.wcs.ctype = ['RA---{}'.format(projection), 'DEC--{}'.format(projection)]
w.wcs.crval = [0, 90]
w.wcs.crpix = [0, 0]      



for angle in solutions:
    angle['coord'] = SkyCoord('{} {}'.format(angle['ra'], angle['dec']) )
    x, y = astropy.wcs.utils.skycoord_to_pixel(angle['coord'], w)
    angle['cartesian'] = x*1, y*1



def circleRadius(b, c, d):
  temp = c[0]**2 + c[1]**2
  bc = (b[0]**2 + b[1]**2 - temp) / 2
  cd = (temp - d[0]**2 - d[1]**2) / 2
  det = (b[0] - c[0]) * (c[1] - d[1]) - (c[0] - d[0]) * (b[1] - c[1])

  if abs(det) < 1.0e-10:
    return None

  # Center of circle
  cx = (bc*(c[1] - d[1]) - cd*(b[1] - c[1])) / det
  cy = ((b[0] - c[0]) * cd - (c[0] - d[0]) * bc) / det

  radius = ((cx - b[0])**2 + (cy - b[1])**2)**.5

  return radius, cx, cy

radius, circle_center_x, circle_center_y = circleRadius(solutions[0]['cartesian'], solutions[1]['cartesian'], solutions[2]['cartesian'])

circle_center = astropy.wcs.utils.pixel_to_skycoord(circle_center_x, circle_center_y, w)
print('Projection: {} - {}, distance to center: {}'.format(projection, circle_center.to_string('hmsdms'), mount_center.separation(circle_center).to_string('deg')))

