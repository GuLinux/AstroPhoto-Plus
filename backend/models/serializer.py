import json


class Serializer:
    def __init__(self, filename, item_class=None):
        self.filename = filename
        self.item_class = item_class

    def get_map(self):
        with open(self.filename, 'r') as json_file:
            return json.load(json_file)

    def load(self):
        return self.item_class.from_map(self.get_map())

    def save(self, item):
        with open(self.filename, 'w') as json_file:
            json.dump(item.to_map(), json_file)
