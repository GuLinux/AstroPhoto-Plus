import { PlateSolving as Actions } from './actions'; 
import { list2object } from '../utils';
import { PLATESOLVING_PAGE } from '../Camera/sections';



// Orion nebula - test solution to avoid having to do an actual plateSolving to display the solution panel
// Just set `solution: testSolution` in defaultState.
// eslint-disable-next-line
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
        [Actions.Options.camera]: true,
        [Actions.Options.telescopeType]: 'main',
        [Actions.Options.fov]: {},
        [Actions.Options.syncTelescope]: true,
        [Actions.Options.slewTelescope]: false,
        [Actions.Options.telescopeSlewAccuracy]: 30,
        [Actions.Options.downsample]: 2,
        [Actions.Options.searchRadius]: 50,
    },
    messages: [],
//   solution: testSolution,
//   previousSolution: {...testSolution, ASTROMETRY_RESULTS_DE: {...testSolution.ASTROMETRY_RESULTS_DE, value: testSolution.ASTROMETRY_RESULTS_DE.value + 2 } },
    targets: [],
};

const setOption = (state, {option, value}) => {
    const newState = {...state, options: {...state.options, [option]: value}};
    if(option === Actions.Options.fovSource && !value) {
        newState.options[Actions.Options.fov] = {};
    }
    return newState;
}

/*
{
  type: 'SET_CURRENT_CAMERA',
  camera: 'Guide Simulator',
  section: 'plateSolving'
}
{
  type: 'PLATESOLVING_SET_OPTION',
  option: 'fovSource',
  value: 'CCD Simulator'
}
*/
const platesolvingSetCurrentCamera = (state, {camera, section}) => {
	if(section !== PLATESOLVING_PAGE) {
		return state;
	}
    return setOption(state, {option: Actions.Options.fovSource, value: camera});
}


const receivedPlatesolvingSolution = (state, {payload}) => {
    const solution = list2object(payload.solution.values, 'name')
    if(state.targetName) {
        return {...state, status: 'idle', loading: false, targets: [...state.targets, {...solution, id: state.targetName}], mainTarget: state.mainTarget || state.targetName, targetName: undefined};
    }
    return {...state, loading: false, solution};
}

const platesolvingRemoveTarget = (state, {object}) => {
    let newState = {...state, targets: state.targets.filter(t => t.id !== object)};
    if(state.mainTarget === object) {
        newState.mainTarget = undefined;
        newState.options[Actions.Options.slewTelescope] = false;
    }
    return newState;
}

export const plateSolving = (state = defaultState, action) => {
    switch(action.type) {
        case 'FETCH_PLATESOLVING_STATUS':
            return {...state, available: false };
        case 'RESPONSE_PLATESOLVING_STATUS':
            return {...state, ...action.response, loading: action.response.status === 'solving'};
        case 'PLATESOLVING_SET_OPTION':
            return setOption(state, action);
        case 'PLATESOLVING_FAILED':
            return {...state, solution: undefined, loading: false };
        case 'PLATESOLVING_SOLVED':
            return receivedPlatesolvingSolution(state, action);
        case 'FETCH_PLATESOLVING_SOLVE_FIELD':
            const previousSolution = state.solution || state.previousSolution;
            return {...state, loading: true, solution: undefined, previousSolution, targetName: action.targetName};
        case 'PLATESOLVING_MESSAGE':
            return {...state, messages: [action.message, ...state.messages.slice(0, 100)]};
        case 'PLATESOLVING_RESET_MESSAGES':
            return {...state, messages: []};
        case 'PLATESOLVING_ADD_TARGET':
            return {...state, targets: [...state.targets, action.object]};
        case 'PLATESOLVING_SET_MAIN_TARGET':
            return {...state, mainTarget: action.object };
        case 'PLATESOLVING_REMOVE_TARGET':
            return platesolvingRemoveTarget(state, action);
        case 'SET_CURRENT_CAMERA':
            return platesolvingSetCurrentCamera(state, action)
        default:
        return state;
    }
}

