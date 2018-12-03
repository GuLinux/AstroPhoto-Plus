import { createSelector } from 'reselect'

export const getProperties = state => state.indiserver.properties;
export const getDeviceIds = state => state.indiserver.devices;
export const getDeviceEntities = state => state.indiserver.deviceEntities;
export const getVisibleDevice = (state, {device}) => device;
export const getVisibleGroup = (state, {group}) => group;

export const getDeviceNames = createSelector([getDeviceIds, getDeviceEntities], (deviceIds, devices) => {
    return deviceIds.map(id => ({ id, name: devices[id].name }))
})

export const getVisibleDeviceProperties = createSelector([getProperties, getVisibleDevice], (properties, visibleDevice) =>
    Object.keys(properties).map(p => properties[p]).filter(p => p.device === visibleDevice)
)

export const getVisibleProperties = createSelector([getVisibleDeviceProperties, getVisibleGroup], (properties, visibleGroup) =>
    properties.filter(p => p.group === visibleGroup)
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

