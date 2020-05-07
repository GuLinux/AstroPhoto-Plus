import { get } from 'lodash';

const defaultState = {
    darv: {
        status: 'idle',
        selectedGuider: 'Manual',
    },
};


export const polarAlignment = (state=defaultState, action) => {
    switch(action.type) {
        case 'POLAR_ALIGNMENT_SET_DARV_GUIDER':
            return {...state, darv: {...state.darv, selectedGuider: action.guider} };
        case 'POLAR_ALIGNMENT_DARV_SET_STATUS':
            return {...state, darv: {...state.darv, status: action.status} };
        default:
            return state;
    }
};

