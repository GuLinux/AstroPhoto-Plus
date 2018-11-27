import { PlateSolving as Actions } from './actions'; 
import { list2object } from '../utils';
const defaultState = {
    options: {
        [Actions.Options.camera]: false,
        [Actions.Options.fov]: {},
        [Actions.Options.syncTelescope]: true,
        [Actions.Options.downsample]: 2,
    },
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
