import { PlateSolving as Actions } from './actions'; 
import { list2object } from '../utils';
const defaultState = {
    options: {
        [Actions.Options.camera]: false,
        [Actions.Options.fov]: {},
    },
};

export const plateSolving = (state = defaultState, action) => {
    switch(action.type) {
        case 'PLATESOLVING_SET_OPTION':
            return {...state, options: {...state.options, [action.option]: action.value }};
        case 'PLATESOLVING_FAILED':
            return {...state, solution: undefined, loading: false };
        case 'PLATESOLVING_SOLVED':
            return {...state, solution: list2object(action.payload.solution.values, 'name'), loading: false };
        case 'CAMERA_SHOT_FINISHED':
            return {...state, cameraFile: action.filename };
        case 'FETCH_PLATESOLVING_SOLVE_FIELD':
            return {...state, loading: true };
        case 'PLATESOLVING_SOLVING_CAMERAFILE':
            return {...state, cameraFile: undefined };
        default:
        return state;
    }
}
