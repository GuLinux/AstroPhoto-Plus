from .pa_platesolving_capture import polar_alignment_platesolving_capture
from errors import BadRequestError

class PolarAlignmentPlatesolvingDrift:
    def first_capture(self, *args, **kwargs):
        polar_alignment_platesolving_capture.reset()
        return polar_alignment_platesolving_capture.capture(*args, **kwargs)

    def second_capture(self, *args, **kwargs):
        return polar_alignment_platesolving_capture.capture(*args, **kwargs)

    def get_drift(self):
        if len(polar_alignment_platesolving_capture.captures) != 2:
            raise BadRequestError('You need to execute two captures')
        dec_drift = polar_alignment_platesolving_capture.coordinates(0).dec - polar_alignment_platesolving_capture.coordinates(1).dec
        return { 'declination_drift': dec_drift.deg }



polar_alignment_platesolving_drift = PolarAlignmentPlatesolvingDrift()

