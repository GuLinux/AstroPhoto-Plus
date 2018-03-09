const defaultState = {
    connected: false,
    host: '',
    port: '',
    devices: [],
    groups: {},
    properties: {}
};

const indiserver = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_SERVER_STATE':
            return {...state, connected: action.state.connected, host: action.state.host, port: action.state.port.toString() } 
        default:
            return state;
    }
}

export default indiserver;
