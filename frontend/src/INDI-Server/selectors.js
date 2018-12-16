import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { getGroupId, getValueId } from './utils';
import { get } from 'lodash';

export const getDevices = state => state.indiserver.devices;
export const getProperties = state => state.indiserver.properties;
export const getValues = state => state.indiserver.values;
const getServerState = state => state.indiserver.state;
const getServiceServerFound = state => state.indiservice.server_found;

const getGroups = state => state.indiserver.groups;


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

export const indiDeviceContainerSelector = createCachedSelector([getCurrentDevice, getGroups, getMessages],
    (device, groups, messages) => ({
        device,
        groups,
        messages,
    })
)(getDeviceProp);

const getCurrentGroupProp = (state, {deviceId, groupName}) => getGroupId({device: deviceId, group: groupName});
const getCurrentGroup = createCachedSelector([getCurrentGroupProp, getGroups], (groupId, groups) => groups.entities[groupId])(getCurrentGroupProp);

export const indiDeviceGroupSelector = createCachedSelector([getCurrentGroup], (group) => ({
    group,
}))(getCurrentGroupProp);

const getPropertyId = (state, {propertyId}) => propertyId;

export const getPropertyInputSelector = (state, {propertyId}) => get(getProperties(state), ['entities', propertyId]);

export const indiPropertyRowSelector = createCachedSelector([getPropertyInputSelector], (property) => ({
    property,
}))(getPropertyId);

    
const getReadOnlyProperty = (state, {readOnly}) => readOnly;

export const indiPropertySelector = createCachedSelector(
    [getPropertyId, getDevices, getProperties, getReadOnlyProperty],
    (propertyId, devices, properties, readOnly) => {
        const property = properties.entities[propertyId];
        return {
            property,
            device: devices.entities[property.device],
            isWriteable: property.perm_write && property.state !== 'CHANGED_BUSY' && ! readOnly,
        };
    }
)(getPropertyId);

const getValueIdProp = (state, {valueId}) => valueId;

export const getValueInputSelectorById = (state, {valueId}) => get(getValues(state), ['entities', valueId]);

export const getValueInputSelector = (deviceId, propertyName, valueName, defaultValue) => state => {
    const valueId = getValueId({device: deviceId, name: propertyName}, {name: valueName});
    return getValueInputSelectorById(state, {valueId}) || defaultValue;
}




export const indiValueSelector = createCachedSelector(
    [getValueInputSelectorById],
    (value) => ({ value }),
)(getValueIdProp);




// TODO: remove
const nullSelector = (...args) => console.log(args);
export const getDevicesProperties = nullSelector;
 
