import { get } from 'lodash';

const defaultState = {
    darv: {
        selectedGuider: 'Manual',
    },
};


export const polarAlignment = (state=defaultState, action) => {
    switch(action.type) {
        case 'POLAR_ALIGNMENT_SET_DARV_GUIDER':
            return {...state, darv: {...state.darv, selectedGuider: action.guider} };
        default:
            return state;
    }
};

