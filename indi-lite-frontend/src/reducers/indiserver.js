const defaultState = {
    connected: false,
    host: '',
    port: '',
    devices: [],
    groups: [],
    properties: [],
    pendingProperties: [],
};

const receivedServerState = (state, action) => {
    let nextState = {...state, connected: action.state.connected, host: action.state.host, port: action.state.port.toString()};
    if(! nextState.connected) {
        nextState.devices = [];
        nextState.groups = [];
        nextState.properties = [];
        nextState.pendingProperties = [];
    }
    return nextState;
}

const remapProperties = (state, device, groups, properties) => {
    let nextStateProperties = state.properties.filter(property => property.device !== device);
    let nextStateGroups = state.groups.filter( group => group.device !== device);
    return {...state, groups: [...groups, ...nextStateGroups], properties: [...properties, ...nextStateProperties]};
}

const addPendingProperty = (state, property) => {
    let pendingProperties = state.pendingProperties.filter(p => p.device !== property.device && p.group !== property.group && p.name !== property.name && p.valueName !== property.valueName);
    if(property.currentValue !== property.newValue) {
        pendingProperties = [...pendingProperties, property]
    }
    return {...state, pendingProperties};
}

const indiserver = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_SERVER_STATE':
            return receivedServerState(state, action);
        case 'RECEIVED_INDI_DEVICES':
            return {...state, devices: action.devices};
        case 'RECEIVED_DEVICE_PROPERTIES':
            return remapProperties(state, action.device, action.groups, action.properties)
        case 'ADD_PENDING_PROPERTY':
            return addPendingProperty(state, action.property);
        default:
            return state;
    }
}

export default indiserver;
