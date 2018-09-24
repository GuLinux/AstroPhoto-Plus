from .device import Device
from errors import NotFoundError, FailedMethodError
from models import random_id
from system import settings
from images import Image, camera_images_db
from astropy.io import fits
from astropy.nddata.utils import Cutout2D
import shutil
import os
import time
from app import logger


class Camera:
    IMAGES_LIST_SIZE = 3

    def __init__(self, settings, client, logger, device=None, camera=None):
        self.settings = settings
        self.client = client
        self.logger = logger
        self.images_db = camera_images_db

        if device:
            self.device = device
            self.camera = [c for c in self.client.cameras() if c.name == device.name]
            if not self.camera:
                raise NotFoundError('Camera {} not found'.format(device.name))
            self.camera = self.camera[0]

        elif camera:
            self.camera = camera
            self.device = Device(client, logger, name=camera.name)

    @property
    def id(self):
        return self.device.id

    def to_map(self):
        return {
            'id': self.id,
            'device': self.device.to_map(),
            'connected': self.camera.connected,
        }


    def indi_sequence_camera(self):
        return self.camera

    def shoot_image(self, options):
        id = random_id(None)

        if self.__has_dev_fits():
            return self.__dev_fits(options, id)
        exposure = options['exposure']
        try:
            self.camera.set_upload_to('local')

            if 'roi' in options and options['roi']:
                self.camera.set_roi({
                    'X': options['roi']['x'],
                    'Y': options['roi']['y'],
                    'WIDTH': int(options['roi']['width']/8)*8,
                    'HEIGHT': int(options['roi']['height']/2)*2,
                }) 
            else:
                self.camera.clear_roi()

            self.camera.set_upload_path(self.settings.camera_tempdir, prefix=id)
            self.logger.debug('Camera.shoot: id={}, parameters: {}'.format(id, options))

            self.camera.shoot(exposure)
            self.camera.clear_roi()
        except RuntimeError as e:
            raise FailedMethodError(str(e))

        filename = [x for x in os.listdir(self.settings.camera_tempdir) if x.startswith(id)]
        if not filename:
            raise FailedMethodError('Image file with id {} not found'.format(id))
        image = self.__new_image_to_list(filename[0], id)
        return image.to_map(for_saving=False)


    def __has_dev_fits(self):
        return os.environ.get('DEV_MODE', '0') == '1' \
            and 'SAMPLE_FITS_PATH' in os.environ \
            and os.environ['SAMPLE_FITS_PATH'] \
            and os.path.isdir(os.environ['SAMPLE_FITS_PATH']) \
            and [x for x in os.listdir(os.environ['SAMPLE_FITS_PATH']) if x.lower().endswith('.fits')]

    def __dev_fits(self, options, id):
        time.sleep(options['exposure'])
        sample_fits = [x for x in os.listdir(os.environ['SAMPLE_FITS_PATH']) if x.lower().endswith('.fits')]
        file_index = int(time.time() * 1000) % len(sample_fits)
        dest_filename = '{}.fits'.format(id)

        
        source_path = os.path.join(os.environ['SAMPLE_FITS_PATH'], sample_fits[file_index])
        dest_path = os.path.join(self.settings.camera_tempdir, dest_filename)
        logger.debug('{} ==> {}'.format(source_path, dest_path))

        if 'roi' in options and options['roi']:
            roi = options['roi']
            with fits.open(source_path) as hdu:
                data = hdu[0].data
                full_height, full_width = hdu[0].shape
                logger.debug('shape: {}x{}'.format(full_width, full_height))
                cutout_size = (roi['height'], roi['width'])
                cutout_center = ( roi['x'] + roi['width']/2, roi['y'] + roi['height']/2 )
                cutout = Cutout2D(data, cutout_center, cutout_size, copy=True)
                hdu[0].data = cutout.data
                hdu.writeto(dest_path)
        else:
            shutil.copyfile(
                source_path,
                dest_path,
                follow_symlinks=True)
        image = self.__new_image_to_list(dest_filename, id)
        return image.to_map(for_saving=False)


    def __new_image_to_list(self, filename, id):
        image = Image(self.settings.camera_tempdir, filename, time.time(), id=id)

        current_images = self.images_db.all()

        if len(current_images) >= Camera.IMAGES_LIST_SIZE:
            to_remove = sorted(current_images, key=lambda i: i.timestamp)[0:len(current_images) - Camera.IMAGES_LIST_SIZE]
            for older_image in to_remove:
                try:
                    self.images_db.remove(older_image.id, remove_fits=True)
                except NotFoundError as e:
                    logger.warning('image not found, ignoring', e)

        self.images_db.add(image)
        return image

