import { createSelector } from 'reselect'
import { get } from 'lodash';

const getProperties = state => state.indiserver.properties;
const getDeviceIds = state => state.indiserver.devices;

export const getDeviceEntities = state => state.indiserver.deviceEntities;

const getVisibleDevice = (state, {device}) => device;


const getValues = (state) => state.indiserver.values;
const getDeviceValues = (state, {device}) => get(state.indiserver.values, device, {});
const getPropertyValues = (state, {device, property}) => get(state.indiserver.values, [device, property], {});

export const getDeviceNames = createSelector([getDeviceIds, getDeviceEntities], (deviceIds, devices) => {
    return deviceIds.map(id => ({ id, name: devices[id].name }))
})

const getVisibleDeviceProperties = createSelector([getProperties, getVisibleDevice], (properties, visibleDevice) =>
    Object.keys(properties).map(p => properties[p]).filter(p => p.device === visibleDevice)
)

export const getVisibleGroups = createSelector([getVisibleDeviceProperties], properties => {
    let groups = properties.map(p => p.group);
    groups = groups.filter((group, index) => groups.indexOf(group) === index)
    return groups;
});


export const getDevicesProperties = createSelector([getDeviceIds, getProperties], (devices, properties) =>
    Object.keys(properties).reduce( (mapping, id) => {
        let property = properties[id];
        let deviceID = property.device;
        return {...mapping, [deviceID]: {...mapping[deviceID], [property.name]: property } }
    } , {})
)

export const getDevicesConnectionState = createSelector([getDevicesProperties], (devicesProperties) =>
    Object.keys(devicesProperties).reduce( (mapping, id) => ({
        ...mapping,
        [id]: 'CONNECTION' in devicesProperties[id] && !! devicesProperties[id].CONNECTION.values.find(v => v.name === 'CONNECT' && v.value)
    }), {})
)

export const getMessages = createSelector([state => state.indiserver.messages], (messages) => messages.reduce( (acc, message) => {
    const { device } = message;
    const currentDeviceMessages = acc[device] || [];
    return {
        ...acc,
        [device]: [message, ...currentDeviceMessages],
    };
}, {})); 


const getPropsGroup = (state, {group}) => group;
export const getVisibleProperties = createSelector([
    getVisibleDeviceProperties,
    getPropsGroup,
], (properties, group) =>
    group && properties.filter(p => p.group === group)
);


const propertyWithValues = (property, values) => ({...property, values: property.values.map(k => get(values, k))});

export const indiDeviceGroupSelector = createSelector([getPropsGroup, getVisibleProperties], (group, properties) => {
    return {
        group,
        properties,
    };
})


export const indiPropertySelector = () => createSelector([
    (state, {propertyId, readOnly}) => ({propertyId, readOnly}),
    getProperties,
    getValues,
    getDeviceEntities,
], ({propertyId, readOnly}, properties, values, deviceEntities) => {
    const property = propertyWithValues(properties[propertyId], values);
    return {
        property,
        device: deviceEntities[property.device],
        isWriteable: property.perm_write && property.state !== 'CHANGED_BUSY' && ! readOnly,
    };
});

