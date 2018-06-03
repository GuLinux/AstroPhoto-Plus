import os
from .serializer import Serializer


class Settings:
    def __init__(self):
        self.default_datadir = os.environ.get('STARQUEW_DATADIR', os.path.join(os.environ['HOME'], 'StarQuew-Data'))
        self.serializer = Serializer(os.path.join(self.default_datadir, '.config', 'settings.json'), Settings)
        self.sequences_list = os.path.join(self.default_datadir, '.config', 'sequences')
        self.indi_profiles_list = os.path.join(self.default_datadir, '.config', 'indi_profiles')
        self.reload()

    def reload(self):
        json_map = {}
        try:
            json_map = self.serializer.get_map()
        except FileNotFoundError:
            pass
        self.sequences_dir = json_map.get('sequences_path', os.path.join(self.default_datadir, 'Sequences'))
        self.indi_prefix = json_map.get('indi_prefix', '/usr')
