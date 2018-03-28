const defaultState = {
        state: {
        connected: false,
        host: '',
        port: '',
    },
    deviceEntities: {},
    devices: [],
    groups: {},
    properties: {},
    pendingValues: {},
    messages: [],
};

const groupID = (deviceID, group) => deviceID + '-' + group;
const createGroup = (deviceID, group) => ({name: group, id: groupID(deviceID, group) });

const receivedServerState = (state, action) => {
    let nextState = {...state, state: {connected: action.state.connected, host: action.state.host, port: action.state.port.toString()}};
    if(! nextState.state.connected) {
        nextState.devices = [];
        nextState.deviceEntities = {}
        nextState.groups = {};
        nextState.properties = {};
        nextState.pendingValues = {};
    }
    return nextState;
}

const arrayToObjectById = array => array.reduce( (obj, element) => ({...obj, [element.id]: element}), {});

const remapProperty = (property, device) => ({...property, group: groupID(property.device, property.group)})

const receivedDeviceProperties = (state, device, properties) => {

    let allGroups = arrayToObjectById(Object.keys(state.groups).filter(id => state.groups[id].device !== device.id).map(id => state.groups[id]));
    let allProperties = arrayToObjectById(Object.keys(state.properties).filter(id => state.properties[id].device !== device.id).map(id => state.properties[id]));

    let deviceGroups = properties.map(p => p.group);
    deviceGroups = deviceGroups.filter( (name, index) => index === deviceGroups.indexOf(name)).map(name => createGroup(device.id, name));
    let deviceProperties = properties.map(p => remapProperty(p, device));

    let deviceUpdated = {...state.deviceEntities[device.id], groups: deviceGroups.map(g => g.id), properties: deviceProperties.map(p => p.id)};

    allGroups = {...allGroups, ...arrayToObjectById(deviceGroups)};
    allProperties = {...allProperties, ...arrayToObjectById(deviceProperties)};

    return {...state, deviceEntities: {...state.deviceEntities, [deviceUpdated.id]: deviceUpdated}, groups: allGroups, properties: allProperties };
}

const indiPropertyUpdated = (state, property) => {
    let device = state.deviceEntities[property.device];
    return {...state, properties: {...state.properties, [property.id]: remapProperty(property, device) } }
};

const indiPropertyAdded = (state, property) => {
    let device = state.deviceEntities[property.device];
    let group = createGroup(property.device, property.group);
    let groupIds = [...device.groups, group.id];
    device = {...device, properties: [...device.properties, property.id], groups: groupIds.filter( (id, index) => index === groupIds.indexOf(id)) };
    let newProperty = remapProperty(property);
    return {...state, deviceEntities: {...state.deviceEntities, [device.id]: device}, groups: {...state.groups, [group.id]: group}, properties: {...state.properties, [newProperty.id]: newProperty} };
};

const indiPropertyRemoved = (state, property) => {
    let device = {...state.deviceEntities[property.device], properties: state.deviceEntities[property.device].properties.filter(id => id !== property.id)};
    let properties = {...state.properties};
    delete properties[property.id]
    return {...state, properties, deviceEntities: {...state.deviceEntities, [device.id]: device}};    
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

const deviceEntity = (device, groups=[], properties=[]) => ({...device, properties, groups, })

const receivedINDIDevices = (state, devices) => ({
    ...state,
    deviceEntities: arrayToObjectById(devices.map(d => ({...d, properties: [], groups: []}) )),
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
            return {...state, devices: [...state.devices, action.device.id], deviceEntities: {...state.deviceEntities, [action.device.id]: {...action.device, groups: [], properties: []}}}
        case 'INDI_DEVICE_REMOVED':
            return indiDeviceRemoved(state, action.device);
        default:
            return state;
    }
}

export default indiserver;
