import json
import time
import os
from app import logger


class Shot:
    def __init__(self, number, exposure, filename, camera=None, blob_listener=None):
        self.number = number
        self.exposure = exposure
        self.filename = filename
        self.blob, self.time_started, self.time_finished, self.temperature_started, self.temperature_finished = (None,) * 5
        if camera and blob_listener:
            self.shoot(camera, blob_listener)

    def shoot(self, camera, blob_listener):
        self.time_started = time.time()
        self.temperature_started = self.__ccd_temperature(camera)
        camera.shoot(self.exposure)
        self.time_finished = time.time()
        self.temperature_finished = self.__ccd_temperature(camera)
        self.blob = blob_listener.get()
        logger.debug('shoot: {}'.format(self))

    def save(self):
        logger.debug('starting save: {}'.format(self))
        info_json = os.path.join(os.path.dirname(self.filename), 'info', os.path.basename(self.filename) + '.json')
        os.makedirs(os.path.dirname(info_json), exist_ok=True)
        info = {
            'exposure': self.exposure,
            'number': self.number,
            'time_started': self.time_started,
            'time_finished': self.time_finished,
        }
        if self.temperature_started is not None:
            info.update({ 'temperature_started': self.temperature_started })
        if self.temperature_finished is not None:
            info.update({ 'temperature_finished': self.temperature_started })
        if self.temperature_started is not None and self.temperature_finished is not None:
            info.update({ 'temperature_average': (self.temperature_started + self.temperature_finished) / 2 })
        with open(info_json, 'w') as info_file:
            json.dump(info, info_file)

        self.blob.save(self.filename)
        logger.debug('saved: {}'.format(self))

    def __ccd_temperature(self, camera):
        if camera.has_control('CCD_TEMPERATURE', 'number'):
            return camera.values('CCD_TEMPERATURE', 'number')['CCD_TEMPERATURE_VALUE']
        return None


    def __str__(self):
        s = 'Shot[number={}, exposure={}, filename='.format(self.number, self.exposure, self.filename)
        if self.blob:
            s += ', blob={} bytes'.format(self.blob.size)
        if self.temperature_started:
            s += ', temperature_started={}'.format(self.temperature_started)
        if self.temperature_finished:
            s += ', temperature_finished={}'.format(self.temperature_finished)
        if self.time_started:
            s += ', time_started={}'.format(self.time_started)
        if self.time_finished:
            s += ', time_finished={}'.format(self.time_finished)
        s += ']'
        return s

    def __repr__(self):
        return self.__str__()


