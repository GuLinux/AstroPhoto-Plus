from .exceptions import NotFoundError
from contextlib import contextmanager


class SequencesList:
    def __init__(self):
        self.sequences = []

    def append(self, sequence):
        self.sequences.append(sequence)

    def remove(self, sequence):
        self.sequences = [x for x in self.sequences if x.id != sequence.id]

    def lookup(self, sequence_id):
        sequence = [x for x in self.sequences if x.id == sequence_id]
        if not sequence:
            raise NotFoundError('Sequence with id {} was not found')
        return sequence[0]
    
    @contextmanager
    def lookup_edit(self, sequence_id):
        yield self.lookup(sequence_id)
        # TODO: save to file

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
