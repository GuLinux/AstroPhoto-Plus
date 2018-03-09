const defaultState = {
    connected: false,
    host: '',
    port: '',
    devices: [],
    groups: {},
    properties: {}
};

const receivedServerState = (state, action) => {
    let nextState = {...state, connected: action.state.connected, host: action.state.host, port: action.state.port.toString()};
    if(! nextState.connected) {
        // TODO: remove properties and groups for this device, and replace them with the new ones.
        nextState.devices = [];
        nextState.groups = {};
        nextState.properties = {};
    }
    return nextState;
}

const remapProperties = (state, device, groups, properties) => {
    let nextStateGroups = {};
    let nextStateProperties = {};
    return state;
}

const indiserver = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_SERVER_STATE':
            return receivedServerState(state, action);
        case 'RECEIVED_INDI_DEVICES':
            return {...state, devices: action.devices};
        case 'RECEIVED_DEVICE_PROPERTIES':
            return remapProperties(state, action.device, action.groups, action.properties)
        default:
            return state;
    }
}

export default indiserver;
