from .exceptions import NotFoundError
from contextlib import contextmanager
from .sequence import Sequence
import json
import os
from redis_client import redis_client


class SavedList:
    def __init__(self, item_class):
        self.item_class = item_class
        self.name= item_class.__name__

    def append(self, item):
        redis_client.append(item.to_map(), self.name) 

    def remove(self, item):
        redis_client.delete(item.id, self.name)
        return item

    def lookup(self, item_id):
        return self.item_class.from_map(redis_client.lookup(item_id, self.name))
#            raise NotFoundError('{} with id {} was not found'.format(self.item_class.__name__, item_id))

    def save(self, item):
        redis_client.update(item.id, item.to_map(), self.name)

    def duplicate(self, item_id):
        item = self.lookup(item_id).duplicate()
        self.append(item)
        return item

    @contextmanager
    def lookup_edit(self, item_id):
        item = self.lookup(item_id)
        yield item
        self.save(item)

    def __len__(self):
        return redis_client.list_length(self.name)

    def __length_hint__(self):
        return self.__len__()

    def __getitem__(self, key):
        return self.item_class.from_map(redis_client.item_at(key, self.name))

    def __setitem__(self, key, value):
        if redis_client.item_exists(key, self.name):
            self.save(value)
        else:
            self.append(item)

    def __iter__(self):
        all_items = [self.item_class.from_map(item) for item in redis_client.list_values(self.name)]
        return all_items.__iter__()

