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
        nextState.devices = [];
        nextState.groups = {};
        nextState.properties = {};
    }
    return nextState;
}

const indiserver = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_SERVER_STATE':
            return receivedServerState(state, action);
        case 'RECEIVED_INDI_DEVICES':
            return {...state, devices: action.devices};
        default:
            return state;
    }
}

export default indiserver;
