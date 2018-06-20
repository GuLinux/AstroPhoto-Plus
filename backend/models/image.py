import os
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
        return Image(item['id'], item['directory'], item['filename'], item['timestamp'], item.get('cached_conversions'))

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

    def histogram(self, bins=50):
        with fits.open(self.path) as fits_file:
            image_data = fits_file[0].data
            values, bins_boundaries = numpy.histogram(image_data, bins=int(bins), range=(0, image_data.max()), density=False)
            return {
                'values': [int(x) for x in values],
                'bins': [float(x) for x in bins_boundaries],
            }


    def __convert(self, args, filepath, format):
        with fits.open(self.path) as fits_file:
            image_data = fits_file[0].data

            if args.get('stretch', '0') == '1':
                image_data = Image.stretch(image_data)
            else:
                if 'clip_low' in args or 'clip_high' in args:
                    image_data = Image.clip(
                        image_data,
                        clip_low_fraction=float(args.get('clip_low', 0)) / 100.,
                        clip_high_fraction=float(args.get('clip_high', 100)) / 100.
                    )

            image_data = Image.normalize(image_data)
            if Image.bpp(image_data) == 16:
                image_data = (image_data / 256)
            maxwidth = int(args.get('maxwidth', '0'))

            image = PIL.Image.fromarray(image_data.astype(numpy.uint8))

            maxwidth = int(args.get('maxwidth', '0'))
            if maxwidth > 0:
                maxheight = image.height / (image.width / maxwidth)
                image.thumbnail((maxwidth,maxheight))
            image.save(filepath, **format['save_options'])


    @staticmethod
    def bpp(image):
        return image.dtype.itemsize * 8

    @staticmethod
    def max_bpp(image):
        return int(math.pow(2, Image.bpp(image))) - 1

    @staticmethod
    def stretch(image):
        hist, bins = numpy.histogram(image, bins=50)
        clip_fraction = 0.07

        clip_opts = [{
            'num': val,
            'low': bins[index],
            'high': bins[index+1],
        } for index, val in enumerate(hist)]

        low_c, high_c = 0, 0
        for index, opt in enumerate(clip_opts):
            high_index = len(clip_opts) - index - 1
            low_c += opt['num']
            high_c += clip_opts[high_index]['num']
            opt['low_cumulative'] = low_c
            clip_opts[high_index]['high_cumulative'] = high_c

        clip_low = [x for x in clip_opts if x['low_cumulative'] >= image.size * clip_fraction][0]['low']
        clip_high = [x for x in clip_opts if x['high_cumulative'] >= image.size * clip_fraction][-1]['high']
        return Image.clip(image, clip_low=clip_low, clip_high=clip_high)

    @staticmethod
    def clip(image, clip_low_fraction=0, clip_high_fraction=1, clip_low=None, clip_high=None):
        max_bpp = Image.max_bpp(image)

        if clip_low is None:
            clip_low = max_bpp * clip_low_fraction
        if clip_high is None:
            clip_high = max_bpp * clip_high_fraction

        clipped = numpy.clip(image, clip_low, clip_high).astype(image.dtype)
        return clipped


    @staticmethod
    def normalize(image):
        max_bpp = Image.max_bpp(image)

        image_min = image.min()
        image_max = image.max()
        normalized = (image - image_min) * ((max_bpp)/(image_max-image_min)).astype(image.dtype)
        return normalized


    def remove_files(self):
        os.remove(self.path)
        for file in [x for x in os.listdir(self.directory) if x.startswith(self.id)]:
            os.remove(os.path.join(self.directory, file))
