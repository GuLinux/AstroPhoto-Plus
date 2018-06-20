from .device import Device
from .exceptions import NotFoundError, FailedMethodError
from .saved_list import SavedList
from .model import random_id
from .image import Image
from astropy.io import fits
import shutil
import os
import time


class Camera:
    IMAGES_LIST_SIZE = 3

    def __init__(self, settings, client, logger, device=None, camera=None):
        self.settings = settings
        self.client = client
        self.logger = logger
        self.images_list = SavedList(settings.camera_tempdir, Image)

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
        self.camera.set_upload_to('local')

        if 'roi' in options and options['roi']:
            self.camera.set_roi({
                'X': options['roi']['x'],
                'Y': options['roi']['y'],
                'WIDTH': options['roi']['width'],
                'HEIGHT': options['roi']['height'],
            }) 
        else:
            self.camera.clear_roi()

        self.camera.set_upload_path(self.settings.camera_tempdir, prefix=id)
        try:
            self.camera.shoot(exposure)
        except RuntimeError as e:
            raise FailedMethodError(str(e))

        filename = [x for x in os.listdir(self.settings.camera_tempdir) if x.startswith(id)]
        if not filename:
            raise FailedMethodError("Image file not found")
        return self.__image_from_fits(filename[0], id)


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
        shutil.copyfile(
            os.path.join(os.environ['SAMPLE_FITS_PATH'], sample_fits[file_index]),
            os.path.join(self.settings.camera_tempdir, dest_filename),
            follow_symlinks=True)

        return self.__image_from_fits(dest_filename, id)

    def __image_from_fits(self, filename, id):
        image = Image(id, self.settings.camera_tempdir, filename, time.time())

        if len(self.images_list) >= Camera.IMAGES_LIST_SIZE:
            to_remove = sorted(self.images_list, key=lambda i: i.timestamp)[0:len(self.images_list) - Camera.IMAGES_LIST_SIZE]
            for older_image in to_remove:
                self.images_list.remove(older_image).remove_files()

        self.images_list.append(image)

        return image.to_map(for_saving=False)
