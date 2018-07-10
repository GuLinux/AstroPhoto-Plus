from .serializer import Serializer
from .exceptions import NotFoundError
from .image import Image
from contextlib import contextmanager
import os
from .settings import settings


class ImagesDatabase:
    def __init__(self, settings, name='default'):
        self.settings = settings
        self.name = name
        self.serializer = Serializer(os.path.join(settings.images_db_path, 'images_' + name + '.json'))
        self.images = {}

        self.load()
        
    def keys(self):
        return self.images.keys()

    def values(self):
        return [Image.from_map(v) for v in self.images.values()]

    def lookup(self, id):
        if not id in self.images:
            raise NotFoundError('Image with id {} not found in {} database'.format(id, self.name))
        return Image.from_map(self.images[id])

    def to_map(self):
        images = {}
        for id in self.images:
            images[id] = self.lookup(id).to_map(for_saving=False)
        return images

    @contextmanager
    def lookup_edit(self, image_id):
        image = self.lookup(image_id)
        yield image
        self.images[image.id] = image.to_map(for_saving=True)
        self.save()

    def load(self):
        try:
            self.images = self.serializer.get_map()
        except FileNotFoundError:
            self.images = {}

    def save(self):
        self.serializer.save_map(self.images)


    def add(self, image):
        self.images[image.id] = image.to_map(for_saving=True)
        self.save()

    def remove(self, image_id, remove_fits=False):
        image = self.__remove(image_id, remove_fits)
        self.save()

    def remove_all(self, images_ids, remove_fits=False):
        for id in images_ids:
            self.__remove(id, remove_fits)
        self.save()
        

    def __remove(self, image_id, remove_fits):
        if not image_id in self.images:
            raise NotFoundError('Image with id {} not found in {} database'.format(id, self.name))
        image = Image.from_map(self.images.pop(image_id))
        image.remove_files(remove_fits=remove_fits)
        self.save()
        return image


main_images_db = ImagesDatabase(settings)
camera_images_db = ImagesDatabase(settings, 'camera')
