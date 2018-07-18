class FilterWheelSequenceItem:
    def __init__(self, data):
        self.filter_number = data.get('filterNumber')
       
    def to_map(self):
        return {
            'filterNumber': self.filter_number,
        }

    def run(self, server, devices, root_path, event_listener, logger, on_update, index):
        wheel = devices['filter_wheel']
        logger.debug('Changing filter to {} on filter wheel {}'.format(self.filter_number, wheel))
        wheel.indi_sequence_filter_wheel().set_filter_number(self.filter_number)
        
        if wheel.indi_sequence_filter_wheel().current_filter()[0] != self.filter_number:
            raise RuntimeError('Error changing filter wheel to filter {}'.format(self.filter_number))


    def reset(self):
        pass

