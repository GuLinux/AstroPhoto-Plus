from system import controller
from errors import FailedMethodError
import astropy.units as u
from astropy.coordinates import SkyCoord, Angle

class PolarAlignmentPlatesolvingCapture:
    def __init__(self):
        self.captures= []

    def capture(self, camera, exposure, solver_options):
        self.captures.append(self.__capture_and_solve(camera, exposure, solver_options))

        return self.captures[-1]

    def reset(self):
        self.captures = []

    def coordinates(self, solution_index):
        solution_dict = self.captures[solution_index]
        return SkyCoord(ra=solution_dict['ASTROMETRY_RESULTS_RA'], dec=solution_dict['ASTROMETRY_RESULTS_DE'], unit=u.deg)

    def __capture_and_solve(self, camera, exposure, solver_options):
        shot = dict()
        if 'test_file' in solver_options:
            shot = { 'filename': solver_options['test_file'] }
        else:
            camera = controller.indi_server.camera(camera)
            shot = camera.shoot_image({ 'exposure': exposure })
        options = {
            'sync': True,
            'filePath': shot['filename'],
        }
        options.update(solver_options)
        return self.__parse_solution(controller.platesolving.solve_field(options))

    def __parse_solution(self, solution):
        if 'solution' in solution:
            return dict([(s['name'], s['value']) for s in solution['solution']['values']])
        else:
            raise FailedMethodError(message='Failed platesolving Polar Alignment image', payload=solution)



polar_alignment_platesolving_capture = PolarAlignmentPlatesolvingCapture()
