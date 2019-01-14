import os
import time
import hashlib
from astropy.io import fits
from errors import BadRequestError, NotFoundError
from models import random_id 
import math
import numpy
from image_processing.image_processing import ImageProcessing
from utils.benchmark_log import benchlogger
from app import logger
import logging

# TODO:
# - use fits loader (plugin)

class Image:

    FORMATS = {
            'jpeg': {
                'content_type': 'image/jpeg',
                'extension': 'jpg',
                'save_options': {
                    'quality': 75,
                },
            },
            'png': {
                'content_type': 'image/png',
                'extension': 'png',
                'save_options': {
                },
            }
        }

    def __init__(self, directory=None, filename=None, timestamp=None, image_info=None, cached_conversions=None, id=None, path=None, file_required=False):
        self.id = random_id(id)
        if directory and filename:
            self.directory = directory
            self.filename = filename
        elif path:
            self.directory, self.filename = os.path.split(path)
        else:
            raise RuntimeError('Constructed image without file/directory nor path')

        if file_required and not os.path.isfile(self.path):
            raise RuntimeError('File {} not found'.format(self.path))

        self.timestamp = timestamp if timestamp else time.time()
        self.image_info = image_info
        if not image_info and os.path.isfile(self.path):
            with fits.open(self.path) as hdulist:
                shape = hdulist[0].shape
                self.image_info = { 'width': shape[1], 'height': shape[0], 'size': os.stat(self.path).st_size }
        self.cached_conversions = {}
        if cached_conversions:
            self.cached_conversions.update(cached_conversions)

    @property
    def path(self):
        return os.path.join(self.directory, self.filename)

    @staticmethod
    def from_map(item, **kwargs):
        return Image(
            id=item['id'],
            directory=item['directory'],
            filename=item['filename'],
            timestamp=item['timestamp'],
            image_info=item.get('image_info'),
            cached_conversions=item.get('cached_conversions'),
            **kwargs
    )

    def to_map(self, for_saving=True):
        json_map = {
            'id': self.id,
            'directory': self.directory,
            'filename': self.filename,
            'path': self.path,
            'image_info': self.image_info,
            'timestamp': self.timestamp,
        }
        if for_saving:
            json_map.update({'cached_conversions': self.cached_conversions})
        return json_map

    def is_ready(self):
        return os.path.isfile(self.path)

    def wait_until_ready(self, timeout=30):
        started = time.time()
        while not self.is_ready():
            if time.time() - started > timeout:
                raise NotFoundError('File {} not found or not ready'.format(self.path))
            time.sleep(0.5)


    def convert(self, args):
        key = '&'.join(['{}={}'.format(key, value) for key, value in args.items()])
        key = hashlib.md5(key.encode()).hexdigest()
        format_name = args.get('format', 'jpeg')

        if format_name == 'original':
            return self.__file_info(self.path, format_name)

        if key not in self.cached_conversions:
            if format_name not in Image.FORMATS:
                raise BadRequestError('Unrecognized format: {}'.format(format_name))
            format = Image.FORMATS[format_name]
            filename = '{}_{}.{}'.format(self.id, key, format['extension'])
            filepath = os.path.join(self.directory, filename)
            self.__convert(args, filepath, format)
            self.cached_conversions[key] = self.__file_info(filepath, format_name, format['content_type'])
        return self.cached_conversions[key]

    def histogram(self, bins=50, range_int = False):
        # Histogram looks fast enough to be kept in python code. Still worth having a look in the future to see if it's too slow on an older/slower machine, and if the performance gain in C++ would be sensible.
        with fits.open(self.path) as fits_file:
            image_data = fits_file[0].data
            values, bins_boundaries = numpy.histogram(image_data, bins=int(bins), range=(0, image_data.max()), density=False)
            histogram = {
                'values': [int(x) for x in values],
                'bins': [int(x) if range_int else float(x) for x in bins_boundaries],
                'min': int(image_data.min()),
                'max': int(image_data.max()),
                'mean': float(image_data.mean()),
            }
            return histogram

    def __file_info(self, path, format_name, content_type=None):
        directory, filename = os.path.split(path)
        # TODO: autodetect content type if none
        return {
            'filename': filename,
            'directory': directory,
            'format': format_name,
            'content_type': content_type,
            'path': path,
        }

    def __convert(self, args, filepath, format):
        logger.debug('creating ImageProcessing object with path={}, format={}, args={}'.format(self.path, format, args))
        imp = ImageProcessing(self.path, logger.isEnabledFor(logging.DEBUG))
        if args.get('stretch', '0') == '1':
            logger.debug('applying autostretch')
            imp.autostretch()
        else:
            if 'clip_low' in args or 'clip_high' in args:
                clip_low = float(args.get('clip_low', 0)) / 100.
                clip_high = float(args.get('clip_high', 100)) / 100.
                logger.debug('manual clipping: {}, {}'.format(clip_low, clip_high))
                imp.clip(clip_low, clip_high)

        logger.debug('debayering')
        imp.debayer('auto')
        maxwidth = int(args.get('maxwidth', '0'))
        if maxwidth > 0:
            maxheight = int(imp.height() / (imp.width() / maxwidth))
            logger.debug('resizing to {}x{}'.format(maxwidth, maxheight))
            imp.resize(maxwidth, maxheight, 'LINEAR')
        logger.debug('saving to {}'.format(filepath))
        imp.save(filepath)


    def remove_files(self, remove_fits=False):
        def remove_if(file):
            if os.path.exists(file):
                os.remove(file)

        if remove_fits:
            from sequences import Shot
            remove_if(self.path)
            remove_if(Shot.info_filename(self.path))

        if os.path.isdir(self.directory):
            for file in [x for x in os.listdir(self.directory) if x.startswith(self.id) and x != self.filename]:
                remove_if(os.path.join(self.directory, file))

    def __base_output(self):
        if self.id:
            return self.id
        return self.filename + '_conv'
