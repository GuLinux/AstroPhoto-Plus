
class Camera:
    def __init__(self, indi_camera):
        self.indi_camera = indi_camera

    @property
    def name(self):
        return self.indi_camera.name

    def to_map(self):
        return {
            'name': self.name
        }

    def properties(self):
        return self.indi_camera.get_properties()

    def __str__(self):
        return 'Camera: {}'.format(self.name)

    def __repr__(self):
        return self.__str__()

