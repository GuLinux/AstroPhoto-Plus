import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { getPropertyId, getGroupId, getValueId } from './utils';
import { get } from 'lodash';

export const getDevices = state => state.indiserver.devices;
export const getGroups = state => state.indiserver.groups;
export const getProperties = state => state.indiserver.properties;
export const getValues = state => state.indiserver.values;
export const getServerState = state => state.indiserver.state;
const getServiceServerFound = state => state.indiservice.server_found;


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

const getPropertyIdProp = (state, {propertyId}) => propertyId;

export const getPropertyInputSelector = (state, {propertyId}) => get(getProperties(state), ['entities', propertyId]);

export const indiPropertyRowSelector = createCachedSelector([getPropertyInputSelector], (property) => ({
    property,
}))(getPropertyIdProp);

    
const getReadOnlyProperty = (state, {readOnly}) => readOnly;

export const indiPropertySelector = createCachedSelector(
    [getPropertyIdProp, getDevices, getProperties, getReadOnlyProperty],
    (propertyId, devices, properties, readOnly) => {
        const property = properties.entities[propertyId];
        return {
            property,
            device: devices.entities[property.device],
            isWriteable: property.perm_write && property.state !== 'CHANGED_BUSY' && ! readOnly,
        };
    }
)(getPropertyIdProp);

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


const getDeviceProperty = (deviceName, propertyName) => state => get(state, ['indiserver', 'properties', 'entities', getPropertyId(deviceName, propertyName)]);
const getPropertyValue = (deviceName, propertyName, valueName) => state => get(state, ['indiserver', 'values', 'entities', getValueId({ device: deviceName, name: propertyName}, { name: valueName })]);


const getDeviceHasConnectionProperty = (state, deviceName)=> !!getDeviceProperty(deviceName, 'CONNECTION')(state);
const getDeviceHasConfigLoadProperty = (state, deviceName) => !!getDeviceProperty(deviceName, 'CONFIG_PROCESS')(state);
const getDeviceIsConnected = (state, deviceName) => get(getPropertyValue(deviceName, 'CONNECTION', 'CONNECT')(state), 'value');
const getDeviceConfigWasLoaded = (state, deviceName) => get(getPropertyValue(deviceName, 'CONFIG_PROCESS', 'CONFIG_LOAD')(state), 'value');

export const autoconnectSelector = (state, deviceName) => ({
    hasConnectionProperty: getDeviceHasConnectionProperty(state, deviceName),
    hasConfigLoadProperty: getDeviceHasConfigLoadProperty(state, deviceName),
    isConnected: getDeviceIsConnected(state, deviceName),
    configWasLoaded: getDeviceConfigWasLoaded(state, deviceName),
    configLoadState: get(getDeviceProperty(deviceName, 'CONFIG_PROCESS')(state), 'state'),
});

