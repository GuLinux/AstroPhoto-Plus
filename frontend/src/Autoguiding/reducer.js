const defaultState = {};

export const autoguiding = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_PHD2_SERVER_STATUS':
            return {...state, status: {...state.status, ...action.status }};
        case 'PHD2_SERVER_ALREADY_RUNNING':
            return {...state, status: {...state.status, serverAlreadyRunning: true }};
        case 'PHD2_RESET':
            return {...state, status: {...state.status, serverAlreadyRunning: undefined }};
        default:
            return state;
    }
};