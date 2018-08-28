from models import settings
from errors import NotFoundError
from .image import Image
from contextlib import contextmanager
import os
from redis_client import redis_client


class ImagesDatabase:
    def __init__(self, settings, name='default'):
        self.settings = settings
        self.name = name
        self.images = {}

    def lookup(self, image_id, **kwargs):
        image_map = redis_client.lookup(image_id, self.name, 'images')
        if not image_map:
            raise NotFoundError('Image with id {} not found in {} database'.format(image_id, self.name))
        return Image.from_map(image_map, **kwargs)

    @contextmanager
    def lookup_edit(self, image_id, **kwargs):
        image = self.lookup(image_id, **kwargs)
        yield image
        redis_client.update(image_id, image.to_map(for_saving=True), self.name, 'images')

    def add(self, image):
        redis_client.append(image.to_map(for_saving=True), self.name, 'images')

    def remove(self, image_id, remove_fits=False):
        self.__remove(image_id, remove_fits)

    def remove_all(self, images_ids, remove_fits=False):
        for image_id in images_ids:
            self.__remove(image_id, remove_fits)

    def all(self):
        return [Image.from_map(v) for v in redis_client.list_values(self.name, 'images')] 

    def to_map(self):
        images_map = {}
        for image in self.all():
            images_map[image.id] = image.to_map()
        return images_map

    def filter(self, data):
        result = {}
        if 'ids' in data:
            objects = redis_client.multi_lookup(data['ids'], self.name, 'images')
            for object in objects:
                result[object['id']] = Image.from_map(object).to_map()
        return result

    def __remove(self, image_id, remove_fits):
        image = self.lookup(image_id)
        image.remove_files(remove_fits=remove_fits)
        redis_client.delete(image_id, self.name, 'images')
        return image


main_images_db = ImagesDatabase(settings)
camera_images_db = ImagesDatabase(settings, 'camera')
