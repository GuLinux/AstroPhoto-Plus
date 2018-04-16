class ExposureSequenceItem:
    def __init__(self, data):
        self.filter_number = data.get('filter_number')
       
    def to_map(self):
        return {
            'filter_number': self.filter_number,
        }

    def run(self, devices, root_path, logger, on_update):
        wheel = devices['filter_wheel']
        wheel.indi_sequence_filter_wheel.set_filter_number(self.filter_number)

