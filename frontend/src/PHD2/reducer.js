const defaultState = {
    connected: false,
};

export const phd2 = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PHD2_STATUS':
            return {...state, ...action.status, connectionError: action.status.connectionError};
        case 'PHD2_DISCONNECTED':
            return {...defaultState, connectionError: action.errorMessage};
        default:
            return state;
    }

}
