const defaultState = {
    drivers: {},
    groups: {},
    server_running: false,
    server_found: false,
    server_error: false,
};

const receivedFullState = (state, {drivers, groups, is_error, is_running, server_found}) => ({
    ...state,
    drivers,
    groups,
    server_error: is_error,
    server_running: is_running,
    server_found,
})

const indiservice = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_INDI_SERVICE':
            return receivedFullState(state, action.data);
        default:
            return state
    }
}

export default indiservice
