const defaultState = {
    connected: false,
    host: '',
    port: '',
    devices: [],
    groups: [],
    properties: [],
    pendingProperties: [],
    messages: [],
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

const indiPropertyUpdated = (state, property) => {
    let properties = state.properties.filter(p => !(p.name ===property.name && p.device === property.device && p.group === property.group));
    return {...state, properties: [...properties, property]};    
};

const indiPropertyAdded = (state, property) => {
    let groups = state.groups;
    if(state.properties.filter(p => p.device === property.device && p.group === property.group).length === 0) {
        groups = [...groups, {name: property.group, device: property.device}];
    }
    return {...state, properties: [...state.properties, property], groups};
};

const indiPropertyRemoved = (state, property) => {
    let properties = state.properties.filter(p => !(p.name ===property.name && p.device === property.device && p.group === property.group));
    let groups = state.groups
    if(properties.filter(p => p.device === property.device && p.group === property.group).length === 0) {
        groups = groups.filter(g => !(g.name === property.group && g.device === property.device));
    }
    return {...state, properties, groups};    
};



const addPendingProperty = (state, pendingProperty) => {
    let isSamePendingProperty = (first, second) => {
        return first.device === second.device && first.group === second.group && first.name === second.name && first.valueName === second.valueName;
    }
    let pendingProperties = state.pendingProperties.filter(p => ! isSamePendingProperty(p, pendingProperty));
    if(pendingProperty.currentValue !== pendingProperty.newValue) {
        pendingProperties = [...pendingProperties, pendingProperty]
    }
    return {...state, pendingProperties};
}

const addPendingProperties = (state, pendingProperties) => {
    let newState = state;
    for(let p of pendingProperties) {
        newState = addPendingProperty(newState, p);
    }
    return newState;
}

const commitPendingProperties = (state, pendingProperties) => {
    // TODO: set status as busy
    return {...state, pendingProperties: []};
}

const indiserver = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_SERVER_STATE':
            return receivedServerState(state, action);
        case 'RECEIVED_INDI_DEVICES':
            return {...state, devices: action.devices};
        case 'RECEIVED_DEVICE_PROPERTIES':
            return remapProperties(state, action.device, action.groups, action.properties)
        case 'ADD_PENDING_PROPERTIES':
            return addPendingProperties(state, action.pendingProperties);
        case 'COMMIT_PENDING_PROPERTIES':
            return commitPendingProperties(state, action.pendingProperties);
        case 'INDI_DEVICE_MESSAGE':
            return {...state, messages: [...state.messages, { device: action.device, message: action.message}]}
        case 'INDI_PROPERTY_UPDATED':
            return indiPropertyUpdated(state, action.property);
        case 'INDI_PROPERTY_ADDED':
            return indiPropertyAdded(state, action.property);
        case 'INDI_PROPERTY_REMOVED':
            return indiPropertyRemoved(state, action.property);
        case 'INDI_DEVICE_ADDED':
            return {...state, devices: [...state.devices, {name: action.device}]}
        case 'INDI_DEVICE_REMOVED':
            return {
                ...state,
                devices: state.devices.filter(d => d.name === action.device),
                groups: state.groups.filter(g => g.device === action.device),
                properties: state.properties.filter(p => p.device === action.device)
            }
        default:
            return state;
    }
}

export default indiserver;
