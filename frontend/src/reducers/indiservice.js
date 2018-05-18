const defaultState = {
    drivers: {},
    groups: {},
    server_running: false,
    server_found: false,
    server_error: false,
    startStopPending: false,
    selectedDrivers: [],
};

const receivedFullState = (state, {drivers, groups, is_error, is_running, server_found}) => ({
    ...state,
    drivers,
    groups,
    server_error: is_error,
    server_running: is_running,
    server_found,
})

const toggleDriver = (state, driver, selected) => {
    if(! selected)
        return {...state, selectedDrivers: state.selectedDrivers.filter(d => d !== driver)}
    return {...state, selectedDrivers: [...state.selectedDrivers, driver]}
}

const indiServiceStarted = (state, devices) => ({
    ...state,
    server_running: true,
    selectedDrivers: devices,
    startStopPending: false,
})

const indiServiceExited = (state) => ({
    ...state,
    startStopPending: false,
    server_running: false,
})

const indiservice = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_INDI_SERVICE':
            return receivedFullState(state, action.data);
        case 'SELECTED_INDI_DRIVER':
            return toggleDriver(state, action.driver, action.selected);
        case 'FETCH_START_INDI_SERVICE':
        case 'FETCH_STOP_INDI_SERVICE':
            return {...state, startStopPending: true};
        case 'INDI_SERVICE_ERROR_STARTING':
        case 'INDI_SERVICE_ERROR_STOPPING':
            return {...state, startStopPending: false};
        case 'INDI_SERVICE_STARTED':
            return indiServiceStarted(state, action.payload.devices)
        case 'INDI_SERVICE_EXITED':
            return indiServiceExited(state)
        default:
            return state
    }
}

export default indiservice
