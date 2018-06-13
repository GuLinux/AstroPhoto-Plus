import os
import imageio
import hashlib
from astropy.io import fits
from .exceptions import BadRequestError, NotFoundError
import math
import numpy
import PIL.Image

# TODO:
# - use fits loader (plugin)

class Image:

    FORMATS = {
            'jpeg': {
                'content_type': 'image/jpeg',
                'extension': 'jpg',
                'save_options': {
                    'quality': 90,
                },
            },
            'png': {
                'content_type': 'image/png',
                'extension': 'png',
                'save_options': {
                },
            }
        }

    def __init__(self, id, directory, filename, timestamp, cached_conversions=None):
        self.id = id
        self.directory = directory
        self.filename = filename
        self.timestamp = timestamp
        self.cached_conversions = {}
        if cached_conversions:
            self.cached_conversions.update(cached_conversions)

    @property
    def path(self):
        return os.path.join(self.directory, self.filename)

    @staticmethod
    def from_map(item):
        return Image(item['id'], item['directory'], item['filename'], item['timestamp'])

    def to_map(self, for_saving=True):
        json_map = {
            'id': self.id,
            'directory': self.directory,
            'filename': self.filename,
            'path': self.path,
            'timestamp': self.timestamp,
        }
        if for_saving:
            json_map.update({'cached_conversions': self.cached_conversions})
        return json_map

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
                'directory': self.directory,
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
            if image_data.dtype.itemsize == 2:
                image_data = (image_data / 256)
            maxwidth = int(args.get('maxwidth', '0'))

            image = PIL.Image.fromarray(image_data.astype(numpy.uint8))

            maxwidth = int(args.get('maxwidth', '0'))
            if maxwidth > 0:
                maxheight = image.height / (image.width / maxwidth)
                image.thumbnail((maxwidth,maxheight))
            image.save(filepath, **format['save_options'])

    @staticmethod
    def normalize(image, bpp):
        image_min = image.min()
        image_max = image.max()
        new_max = math.pow(2, bpp)

        return (image - image_min) * ((new_max)/(image_max-image_min))

    def remove_files(self):
        os.remove(self.path)
        for file in [x for x in os.listdir(self.directory) if x.startswith(self.id)]:
            os.remove(os.path.join(self.directory, file))
