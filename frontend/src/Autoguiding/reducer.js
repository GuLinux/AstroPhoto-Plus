const defaultState = {};

export const autoguiding = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_AUTOGUIDING_STATUS':
            return {...state, status: action.status};
        default:
            return state;
    }
};