from app import logger
import time


class FilterWheelSequenceJob:
    def __init__(self, data):
        self.filter_number = data.get('filterNumber')
       
    def to_map(self):
        return {
            'filterNumber': self.filter_number,
        }

    def run(self, server, devices, root_path, event_listener, on_update, index):
        wheel = devices['filter_wheel']
        retry = 0
        while True:
            try:
                self.__change_filter(wheel)
                return
            except RuntimeError as e:
                if retry == 5:
                    raise e
                retry += 1
                logger.error('{} - retrying ({} of 5)'.format(e, retry))
                time.sleep(2 * retry)


    def __change_filter(self, wheel):
        logger.info('Changing filter to {} on filter wheel {}'.format(self.filter_number, wheel))
        wheel.indi_sequence_filter_wheel().set_filter_number(self.filter_number)
        
        if wheel.indi_sequence_filter_wheel().current_filter()[0] != self.filter_number:
            raise RuntimeError('Error changing filter wheel to filter {}'.format(self.filter_number))



    def reset(self, remove_files=False):
        pass

