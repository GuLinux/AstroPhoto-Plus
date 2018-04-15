from .exceptions import NotFoundError
from contextlib import contextmanager
from .sequence import Sequence
import json
import os


class SequencesList:
    def __init__(self, sequences_path):
        self.sequences_path = sequences_path
        os.makedirs(sequences_path, exist_ok=True)
        self.sequences = [self.__load_sequence(os.path.join(sequences_path, filename)) for filename in os.listdir(sequences_path) if filename.endswith('.json') ]

    def append(self, sequence):
        self.sequences.append(sequence)
        self.__save_sequence(sequence)

    def remove(self, sequence):
        self.sequences = [x for x in self.sequences if x.id != sequence.id]
        os.remove(self.__path_for(sequence))

    def lookup(self, sequence_id):
        sequence = [x for x in self.sequences if x.id == sequence_id]
        if not sequence:
            raise NotFoundError('Sequence with id {} was not found')
        return sequence[0]

    def save(self, sequence):
        self.__save_sequence(sequence)
    
    @contextmanager
    def lookup_edit(self, sequence_id):
        sequence = self.lookup(sequence_id)
        yield sequence
        self.__save_sequence(sequence)

    def __len__(self):
        return len(self.sequences)

    def __length_hint__(self):
        return self.__len__()

    def __getitem__(self, key):
        return self.sequences[key]

    def __setitem__(self, key, value):
        self.sequences[key] = value

    def __iter__(self):
        return self.sequences.__iter__()

    def __load_sequence(self, sequence_file):
        with open(sequence_file, 'r') as json_file:
            return Sequence.from_map(json.load(json_file))

    def __save_sequence(self, sequence):
        with open(self.__path_for(sequence), 'w') as json_file:
            json.dump(sequence.to_map(), json_file)

    def __path_for(self, sequence):
        return os.path.join(self.sequences_path, sequence.id + '.json')
