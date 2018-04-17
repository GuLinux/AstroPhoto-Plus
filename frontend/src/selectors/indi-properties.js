import { createSelector } from 'reselect'

export const getProperties = state => state.indiserver.properties;
export const getDeviceIds = state => state.indiserver.devices;
export const getDeviceEntities = state => state.indiserver.deviceEntities;
export const getVisibleDevice = state => state.navigation.indi.device;
export const getVisibleGroup = state => state.navigation.indi.group ? state.navigation.indi.group : 'Main Control';

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
