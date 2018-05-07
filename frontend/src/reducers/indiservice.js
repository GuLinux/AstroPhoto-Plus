const defaultState = {
    drivers: {},
    groups: {},
    server_running: false,
    server_found: false,
    server_error: false,
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

const indiservice = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_INDI_SERVICE':
            return receivedFullState(state, action.data);
        case 'SELECTED_INDI_DRIVER':
            return toggleDriver(state, action.driver, action.selected);
        default:
            return state
    }
}

export default indiservice
