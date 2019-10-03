const defaultState = {
    connected: false,
};


const guidingStep = (state, action) => {
    // TODO: record steps to show PHD2 graph
    if(state.starLost && Date.now() - state.lastStarLost < 5000) {
        return state;
    }
    return {...state, starLost: false};
}

export const phd2 = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PHD2_STATUS':
            return {...state, ...action.status, connectionError: action.status.connectionError};
        case 'PHD2_DISCONNECTED':
            return {...defaultState, ...action.payload};
        case 'PHD2_STAR_LOST':
            return {...state, starLost: true, lastStarLost: Date.now()};
        case 'PHD2_GUIDE_STEP':
            return guidingStep(state, action);
        default:
            return state;
    }

}
