import os
import imageio
import hashlib
from astropy.io import fits
from .exceptions import BadRequestError, NotFoundError
import math
import numpy




class Image:

    FORMATS = {
            'jpeg': {
                'content_type': 'application/jpeg',
                'extension': 'jpg',
                'imwrite_options': {
                },
                'imageio_format': 'JPEG-PIL',
            },
            'png': {
                'content_type': 'application/png',
                'extension': 'png',
                'imwrite_options': {
                },
                'imageio_format': 'PNG-PIL',
            }
        }

    def __init__(self, id, directory, filename, timestamp):
        self.id = id
        self.directory = directory
        self.filename = filename
        self.timestamp = timestamp
        self.cached_conversions = {}

    @property
    def path(self):
        return os.path.join(self.directory, self.filename)

    @staticmethod
    def from_map(item):
        return Image(item['id'], item['directory'], item['filename'], item['timestamp'])

    def to_map(self):
        return {
            'id': self.id,
            'directory': self.directory,
            'filename': self.filename,
            'path': self.path,
            'timestamp': self.timestamp,
        }

    def convert(self, args):
        key = '&'.join(['{}={}'.format(key, value) for key, value in args.items()])
        key = hashlib.md5(key.encode()).hexdigest()
        if key not in self.cached_conversions:
            format_name = args.get('format', 'jpeg')
            if format_name not in Image.FORMATS:
                raise BadRequestError('Unrecognized format: {}'.format(format_name))
            format = Image.FORMATS[format_name]
            filename = '{}_{}.{}'.format(self.id, key, format['extension'])
            filepath = os.path.join(self.directory, filename)
            self.__convert(args, filepath, format)
            self.cached_conversions[key] = {
                'filename': filename,
                'format': format_name,
                'content_type': format['content_type'],
                'path': filepath,
            }
        return self.cached_conversions[key]

    def __convert(self, args, filepath, format):
        stretch = args.get('stretch', '0') == '1'
        with fits.open(self.path) as fits_file:
            image_data = fits_file[0].data
            if stretch:
                image_data = Image.normalize(image_data, image_data.dtype.itemsize * 8)
            imageio.imwrite(filepath, image_data, format=format['imageio_format'], **format['imwrite_options'])

    @staticmethod
    def normalize(image, bpp):
        image_min = image.min()
        image_max = image.max()
        new_max = math.pow(2, bpp)

        return (image - image_min) * ((new_max)/(image_max-image_min))
