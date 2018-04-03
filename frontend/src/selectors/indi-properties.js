import { createSelector } from 'reselect'

const getProperties = state => state.indiserver.properties;
const getVisibleDevice = state => state.navigation.indi.device;
const getVisibleGroup = state => state.navigation.indi.group ? state.navigation.indi.group : 'Main Control';

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


