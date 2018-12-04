import { list2object } from '../utils';
import { get, set } from 'lodash';

const defaultState = {
        state: {
        connected: false,
        host: '',
        port: '',
    },
    deviceEntities: {},
    devices: [],
    properties: {},
    values: {},
    messages: [],
};

const receivedServerState = (state, action) => {
    let nextState = {...state, state: {connected: action.state.connected, host: action.state.host, port: action.state.port.toString()}};
    if(! nextState.state.connected) {
        nextState.devices = [];
        nextState.deviceEntities = {}
        nextState.properties = {};
    }
    return nextState;
}

const valueKey = (property, value) => `${property.device}.${property.name}.${value.name}`;

const propertyUpdated = ({values, ...rest}, state) => {
    const prevProp = state.properties[rest.id];
    const property = {...rest, values: values && values.map(v => valueKey(rest, v)) };
    if(JSON.stringify(property) !== JSON.stringify(prevProp)) {
        state = {...state, properties: {...state.properties, [property.id]: property} };
    }
    values && values.forEach(v => state = valueUpdated(property, v, state));
    return state;
}

const valueUpdated = (property, value, state) => {
    const key = valueKey(property, value);
    const prevValue = get(state.values, key);
    if(JSON.stringify(value) === JSON.stringify(prevValue))
        return state;
    const values = {...state.values};
    set(values, key, value);
    return {...state, values };
}


const receivedDeviceProperties = (state, device, deviceProperties) => {
    deviceProperties.forEach(property => {
        state = propertyUpdated(property, state);
    })

    return state;
}

const indiPropertyUpdated = (state, property) => propertyUpdated(property, state);

const indiPropertyAdded = (state, property) => propertyUpdated(property, state);

const indiPropertyRemoved = (state, property) => {
    let properties = {...state.properties};
    let values = {...state.values};
    delete properties[property.id]
    property.values.forEach(v => delete values[valueKey(property, v)]);
    return {...state, properties, values}
};

const changePropertyValues = (state, {property}) => {
    return {
            ...state,
           properties: {
                ...state.properties, [property.id]: {
                    ...state.properties[property.id], state: 'CHANGED_BUSY'
                }
            }
    };
}

const receivedINDIDevices = (state, devices) => ({
    ...state,
    deviceEntities: list2object(devices, 'id'),
    devices: devices.map(d => d.id),
})

const indiDeviceConnected = (state, device) => ({
    ...state,
    deviceEntities: {...state.deviceEntities, [device]: {...state.deviceEntities[device], lastConnected: Date.now(), configAutoloaded: false } },
});

const indiConfigAutoloaded = (state, device) => ({
    ...state,
    deviceEntities: {...state.deviceEntities, [device]: {...state.deviceEntities[device], configAutoloaded: true } },
});



const indiDeviceDisconnected = (state, device) => ({
    ...state,
    deviceEntities: {...state.deviceEntities, [device]: {...state.deviceEntities[device], lastDisConnected: Date.now() } },
});


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
        case 'INDI_REQUEST_SET_PROPERTY_VALUES':
            return changePropertyValues(state, action);
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
        case 'INDI_DEVICE_CONNECTED':
            return indiDeviceConnected(state, action.device);
        case 'INDI_DEVICE_DISCONNECTED':
            return indiDeviceDisconnected(state, action.device);
        case 'INDI_CONFIG_AUTOLOADED':
            return indiConfigAutoloaded(state, action.device);
        default:
            return state;
    }
}

export default indiserver;
