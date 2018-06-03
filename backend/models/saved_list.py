from .exceptions import NotFoundError
from contextlib import contextmanager
from .sequence import Sequence
from .serializer import Serializer
import json
import os


class SavedList:
    def __init__(self, items_path, item_class):
        self.items_path = items_path
        self.item_class = item_class
        self.items = [Serializer(os.path.join(items_path, filename), self.item_class).load() for filename in os.listdir(items_path) if filename.endswith('.json') ]


    def append(self, item):
        self.items.append(item)
        self.__save_item(item)

    def remove(self, item):
        self.items = [x for x in self.items if x.id != item.id]
        os.remove(self.__path_for(item))

    def lookup(self, item_id):
        item = [x for x in self.items if x.id == item_id]
        if not item:
            raise NotFoundError('{} with id {} was not found'.format(self.item_class.__name__, item_id))
        return item[0]

    def save(self, item):
        self.__save_item(item)

    def duplicate(self, item_id):
        item = self.lookup(item_id).duplicate()
        self.append(item)
        return item

    @contextmanager
    def lookup_edit(self, item_id):
        item = self.lookup(item_id)
        yield item
        self.__save_item(item)

    def __len__(self):
        return len(self.items)

    def __length_hint__(self):
        return self.__len__()

    def __getitem__(self, key):
        return self.items[key]

    def __setitem__(self, key, value):
        self.items[key] = value

    def __iter__(self):
        return self.items.__iter__()

    def __save_item(self, item):
        Serializer(self.__path_for(item), self.item_class).save(item)

    def __path_for(self, item):
        return os.path.join(self.items_path, item.id + '.json')
