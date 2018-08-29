class GuiderControl:
    def __init__(self, driver):
        self.driver = driver


    def move(self, ra, dec):
        # Translate movement into X/Y
        # Translate number of pixels into msecs
        # Invoke `move` in the actual driver
        pass
