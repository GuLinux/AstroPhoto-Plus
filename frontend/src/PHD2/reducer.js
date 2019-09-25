const defaultState = {
    connected: false,
};

export const phd2 = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PHD2_STATUS':
            return {...state, ...action.status};
        case 'PHD2_DISCONNECTED':
            return defaultState;
        default:
            return state;
    }

}
