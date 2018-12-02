import { PlateSolving as Actions } from './actions'; 
import { list2object } from '../utils';



// Orion nebula - test solution to avoid having to do an actual plateSolving to display the solution panel
// Just set `solution: testSolution` in defaultState.
const testSolution = {
    ASTROMETRY_RESULTS_PIXSCALE: {
      format: '%g',
      label: 'Pixscale (arcsec/pixel)',
      max: 10000,
      min: 0,
      name: 'ASTROMETRY_RESULTS_PIXSCALE',
      step: 1,
      value: 2.9572699069976807
    },
    ASTROMETRY_RESULTS_ORIENTATION: {
      format: '%g',
      label: 'Orientation (E of N) °',
      max: 360,
      min: -360,
      name: 'ASTROMETRY_RESULTS_ORIENTATION',
      step: 1,
      value: 171.1909942626953
    },
    ASTROMETRY_RESULTS_RA: {
      format: '%g',
      label: 'RA (J2000)',
      max: 24,
      min: 0,
      name: 'ASTROMETRY_RESULTS_RA',
      step: 1,
      value: 83.84918212890625
    },
    ASTROMETRY_RESULTS_DE: {
      format: '%g',
      label: 'DE (J2000)',
      max: 90,
      min: -90,
      name: 'ASTROMETRY_RESULTS_DE',
      step: 1,
      value: -5.35490608215332
    },
    ASTROMETRY_RESULTS_PARITY: {
      format: '%g',
      label: 'Parity',
      max: 1,
      min: -1,
      name: 'ASTROMETRY_RESULTS_PARITY',
      step: 1,
      value: 0
    },
    ASTROMETRY_RESULTS_WIDTH: {
      label: 'Field width',
      name: 'ASTROMETRY_RESULTS_WIDTH',
      value: 3.824735746383667
    },
    ASTROMETRY_RESULTS_HEIGHT: {
      label: 'Field height',
      name: 'ASTROMETRY_RESULTS_HEIGHT',
      value: 2.891552797953288
    }
};


const defaultState = {
    options: {
        [Actions.Options.camera]: false,
        [Actions.Options.fov]: {},
        [Actions.Options.syncTelescope]: true,
        [Actions.Options.downsample]: 2,
    },
    //solution: testSolution,
};

const setOption = (state, {option, value}) => {
    const newState = {...state, options: {...state.options, [option]: value}};
    if(option === Actions.Options.fovSource && !value) {
        newState.options[Actions.Options.fov] = {};
    }
    return newState;
}

export const plateSolving = (state = defaultState, action) => {
    switch(action.type) {
        case 'PLATESOLVING_SET_OPTION':
            return setOption(state, action);
            return {...state, options: {...state.options, [action.option]: action.value }};
        case 'PLATESOLVING_FAILED':
            return {...state, solution: undefined, loading: false };
        case 'PLATESOLVING_SOLVED':
            return {...state, solution: list2object(action.payload.solution.values, 'name'), loading: false };
        case 'FETCH_PLATESOLVING_SOLVE_FIELD':
            return {...state, loading: true, solution: undefined };
        default:
        return state;
    }
}

