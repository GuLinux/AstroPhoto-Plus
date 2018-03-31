const defaultState = {
        state: {
        connected: false,
        host: '',
        port: '',
    },
    deviceEntities: {},
    devices: [],
    properties: {},
    pendingValues: {},
    messages: [],
};

const receivedServerState = (state, action) => {
    let nextState = {...state, state: {connected: action.state.connected, host: action.state.host, port: action.state.port.toString()}};
    if(! nextState.state.connected) {
        nextState.devices = [];
        nextState.deviceEntities = {}
        nextState.properties = {};
        nextState.pendingValues = {};
    }
    return nextState;
}

const arrayToObjectById = array => array.reduce( (obj, element) => ({...obj, [element.id]: element}), {});

const receivedDeviceProperties = (state, device, properties) => {

    let allProperties = arrayToObjectById(Object.keys(state.properties).filter(id => state.properties[id].device !== device.id).map(id => state.properties[id]));
    allProperties = {...allProperties, ...arrayToObjectById(properties)};

    return {...state, properties: allProperties };
}

const indiPropertyUpdated = (state, property) => {
    return {...state, properties: {...state.properties, [property.id]: property } }
};

const indiPropertyAdded = (state, property) => {
    return {...state, properties: {...state.properties, [property.id]: property} };
};

const indiPropertyRemoved = (state, property) => {
    let properties = {...state.properties};
    delete properties[property.id]
    return {...state, properties};    
};

const addPendingValues = (state, property, pendingValues) => {
    let currentPendingValues = property.id in state.pendingValues ? state.pendingValues[property.id] : {}
    let mergedPendingValues = {...currentPendingValues, ...pendingValues};
    
    Object.keys(mergedPendingValues).forEach(name => {
        if(mergedPendingValues[name] === property.values.filter(v => v.name === name)[0].value)
            delete mergedPendingValues[name]
    });
    
    return {...state, pendingValues: {...pendingValues, [property.id]: mergedPendingValues } };
}

const commitPendingValues = (state, property, pendingValues) => {
    return {
            ...state,
            pendingValues: {
                ...state.pendingValues, [property.id]: {}
           },
           properties: {
                ...state.properties, [property.id]: {
                    ...state.properties[property.id], state: 'CHANGED_BUSY'
                }
            }
    };
}

const receivedINDIDevices = (state, devices) => ({
    ...state,
    deviceEntities: arrayToObjectById(devices),
    devices: devices.map(d => d.id),
})


const indiDeviceRemoved = (state, device) => {
    let devices = state.devices.filter(d => d !== device.id);
    let deviceEntities = {...state.deviceEntities};
    delete deviceEntities[device.id];
    return {...state, deviceEntities, devices};
}

const indiserver = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_SERVER_STATE':
            return receivedServerState(state, action);
        case 'RECEIVED_INDI_DEVICES':
            return receivedINDIDevices(state, action.devices);
        case 'RECEIVED_DEVICE_PROPERTIES':
            return receivedDeviceProperties(state, action.device, action.properties)
        case 'ADD_PENDING_VALUES':
            return addPendingValues(state, action.property, action.pendingValues);
        case 'COMMIT_PENDING_VALUES':
            return commitPendingValues(state, action.property, action.pendingValues);
        case 'INDI_DEVICE_MESSAGE':
            return {...state, messages: [...state.messages, { device: action.device.id, message: action.message}]}
        case 'INDI_PROPERTY_UPDATED':
            return indiPropertyUpdated(state, action.property);
        case 'INDI_PROPERTY_ADDED':
            return indiPropertyAdded(state, action.property);
        case 'INDI_PROPERTY_REMOVED':
            return indiPropertyRemoved(state, action.property);
        case 'INDI_DEVICE_ADDED':
            return {...state, devices: [...state.devices, action.device.id], deviceEntities: {...state.deviceEntities, [action.device.id]: action.device}}
        case 'INDI_DEVICE_REMOVED':
            return indiDeviceRemoved(state, action.device);
        default:
            return state;
    }
}

export default indiserver;
