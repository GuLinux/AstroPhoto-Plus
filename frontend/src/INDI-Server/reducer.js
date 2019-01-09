import { list2object } from '../utils';
import { get, getOr, set, omit } from 'lodash/fp';
import { getPropertyId, getValueId, getGroupId } from './utils';

const devicesDefaultState = {
    devices: {
        ids: [],
        entities: {},
    },
    groups: {
        ids: [],
        entities: {},
    },
    properties: {
        ids: [],
        entities: {},
    },
    values: {
        ids: [],
        entities: {},
    },
};

const defaultState = {
        state: {
        connected: false,
        host: '',
        port: '',
    },
    ...devicesDefaultState,
    messages: [],
};

const receivedServerState = (state, {state: {connected, host, port}}) => {
    const indiState = { connected, host, port: port.toString() };
    if(connected) {
        return {...state, state: indiState };
    }
    return {...state, ...devicesDefaultState, state: indiState};
}


const addGroupsToDevice = (property, prevState) => {
    const groupId = getGroupId(property);
    const groups = getOr([], `devices.entities.${property.device}.groups`, prevState);
    if(groups.includes(groupId)) {
        return prevState;
    }
    let state = set(['devices', 'entities', property.device, 'groups'], [...groups, groupId], prevState);
    state = set('groups.ids', [...prevState.groups.ids.filter(id => id !== groupId), groupId], state);
    return set(['groups', 'entities', groupId], {
        id: groupId,
        name: property.group,
        device: property.device,
        properties: [],
    }, state);
}

const addPropertyToGroup = (property, prevState) => {
    const groupId = getGroupId(property);
    const groupProperties = getOr([], `groups.entities.${groupId}.properties`, prevState);
    if(groupProperties.includes(property.id)) {
        return prevState;
    }
    let state = set(['groups', 'entities', groupId, 'properties'], [...groupProperties, property.id], prevState);
    return set(`properties.ids`, [...prevState.properties.ids, property.id], state);
}

const updatePropertyEntity = (property, prevState, values) => {
    const prevProperty = getOr({}, `properties.entities.${property.id}`, prevState);
    if(JSON.stringify(prevProperty) === JSON.stringify(property)) {
        return prevState;
    }
    return set(['properties', 'entities', property.id], property, prevState);
}

const addValueToState = (property, value, prevState) => {
    const id = getValueId(property, value);
    const prevValue = get(`values.entities.${id}`, prevState);
    const valueIds = get('values.ids', prevState);
    let state = prevState;
    if(!valueIds.includes(id)) {
        state = set('values.ids', [...valueIds, id], state);
    }
    if(JSON.stringify(prevValue) !== JSON.stringify(value)) {
        state = set(['values', 'entities', id], value, state);
    }
    return state;
}

const propertyUpdated = ({values, ...property}, prevState) => {
    property = set('values', values ? values.map(v => getValueId(property, v)) : [], property);
    let state = addGroupsToDevice(property, prevState);
    state = addPropertyToGroup(property, state);
    state = updatePropertyEntity(property, state);
    values && values.forEach(v => {
        state = addValueToState(property, v, state)
    });
    if(property.name === 'CONNECTION') {
        state = set(['devices', 'entities', property.device, 'connected'], values.find(v => v.name === 'CONNECT').value, state);
    }
    return state;
}


const receivedDeviceProperties = (state, device, deviceProperties) => {
    deviceProperties.forEach(property => {
        state = propertyUpdated(property, state);
    })
    return state;
}

const indiPropertyUpdated = (state, property) => propertyUpdated(property, state);

const indiPropertyAdded = (state, property) => propertyUpdated(property, state);

const indiPropertyRemoved = (prevState, property) => {
    let { devices, groups, properties } = prevState;
    let group = groups.entities[getGroupId(property)];
    group = set('properties', group.properties.filter(id => id !== property.id), group);
    if(group.properties.length === 0) {
        groups = {
            ids: groups.ids.filter(id => id !== group.id),
            entities: omit(group.id, groups.entities),
        };
        devices = set(['entities', property.device, 'groups'], devices.entities[property.device].groups.filter(id => id !== group.id), devices);
    } else {
        groups = set(['entities', group.id], group, groups);
    }
    return {
        ...prevState,
        properties: {
            ids: properties.ids.filter(id => id !== property.id),
            entities: omit(property.id, properties.entities),
        },
        groups,
        devices,
    };
}

const changePropertyValues = (state, {property}) => {
    return set(['properties', 'entities', property.id, 'state'], 'CHANGED_BUSY', state);
}

const receivedINDIDevices = (state, devices) => ({
    ...state,
    devices: {
        entities: list2object(devices.map(d => ({...d, groups: []})), 'id'),
        ids: devices.map(d => d.id),
    },
})

const indiDeviceAdded = (state, {device}) => {
    if(! state.devices.ids.includes(device.id)) {
        state = set('devices.ids', [...state.devices.ids, device.id], state);
    }
    const currentDevice = getOr({}, ['devices', 'entities', device.id], state);
    const groups = state.groups.ids.filter(id => state.groups.entities[id].device === device.id);
    return set(['devices', 'entities', device.id], {...currentDevice, ...device, groups}, state);
}

const indiDeviceRemoved = (state, device) => {
    state = set(['devices', 'ids'], state.devices.ids.filter(id => id !== device.id), state);
    state = omit(['devices', 'entities', device.id], state);
    return state;
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
            return indiDeviceAdded(state, action);
        case 'INDI_DEVICE_REMOVED':
            return indiDeviceRemoved(state, action.device);
        case 'INDI_DEVICE_CONNECTED':
            return set(['devices', 'entities', action.device, 'connected'], true, state);
        case 'INDI_DEVICE_DISCONNECTED':
            return set(['devices', 'entities', action.device, 'connected'], false, state);
        case 'INDI_CONFIG_AUTOLOAD_REQUEST':
            return set(['properties', 'entities', getPropertyId(action.deviceName, 'CONFIG_PROCESS'), 'state'], 'CHANGED_BUSY', state)
        case 'INDI_CONFIG_AUTOLOADED':
        default:
            return state;
    }
}

export default indiserver;
