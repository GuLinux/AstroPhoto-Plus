import { createSelector } from 'reselect'
import { get } from 'lodash';
import { getGroupId } from './utils';

const getDevices = state => state.indiserver.devices;
const getServerState = state => state.indiserver.state;
const getServiceServerFound = state => state.indiservice.server_found;

const getGroups = state => state.indiserver.groups;

const getProperties = state => state.indiserver.properties;
const getValues = state => state.indiserver.values;

// Own props
const getDeviceProp = (state, {deviceId}) => deviceId;


export const getMessages = createSelector([state => state.indiserver.messages], (messages) => messages.reduce( (acc, message) => {
    const { device } = message;
    const currentDeviceMessages = acc[device] || [];
    return {
        ...acc,
        [device]: [message, ...currentDeviceMessages],
    };
}, {})); 



export const indiServerContainerSelector = createSelector([getDevices, getServerState, getServiceServerFound],
    (devices, serverState, serviceServerFound) => ({
        devices: devices.ids.map(id => devices.entities[id]),
        hasLocalServer: serviceServerFound && serverState.host === 'localhost',
    })
);


const getCurrentDevice = createSelector([getDeviceProp, getDevices], (deviceId, devices) => devices.entities[deviceId]);

export const indiDeviceContainerSelector = createSelector([getCurrentDevice, getGroups, getMessages],
    (device, groups, messages) => ({
        device,
        groups,
        messages,
    })
);

const getCurrentGroupProp = (state, {deviceId, groupName}) => getGroupId({device: deviceId, group: groupName});
const getCurrentGroup = createSelector([getCurrentGroupProp, getGroups], (groupId, groups) => groups.entities[groupId]);

export const indiDeviceGroupSelector = createSelector([getCurrentGroup], (group) => ({
    group,
}));

const getCurrentPropertyProp = (state, {propertyId}) => propertyId;

export const indiPropertyRowSelector = () => createSelector([getCurrentPropertyProp, getProperties], (propertyId, properties) => ({
    property: properties.entities[propertyId],
}));

    
const getReadOnlyProperty = (state, {readOnly}) => readOnly;

export const indiPropertySelector = () => createSelector(
    [getDevices, getProperties, getCurrentPropertyProp, getReadOnlyProperty],
    (devices, properties, propertyId, readOnly) => {
        const property = properties.entities[propertyId];
        return {
            property,
            device: devices.entities[property.device],
            isWriteable: property.perm_write && property.state !== 'CHANGED_BUSY' && ! readOnly,
        };
    }
);

export const indiValueSelector = () => createSelector(
    [getValues, (state, {valueId}) => valueId],
    (values, valueId) => ({ value: values.entities[valueId] }),
);

