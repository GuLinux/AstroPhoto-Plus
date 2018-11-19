import { PlateSolving as Actions } from './actions'; 
import { list2object } from '../utils';
const defaultState = {
    options: {
        [Actions.Options.camera]: false,
    },
};

export const plateSolving = (state = defaultState, action) => {
    switch(action.type) {
        case 'PLATESOLVING_SET_OPTION':
            return {...state, options: {...state.options, [action.option]: action.value }};
        case 'PLATESOLVING_FAILED':
            return {...state, solution: undefined };
        case 'PLATESOLVING_SOLVED':
            return {...state, solution: list2object(action.payload.solution.values, 'name') };
        default:
        return state;
    }
}
