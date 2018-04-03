import { createSelector } from 'reselect'

const getProperties = state => state.indiserver.properties;
const getVisibleDevice = state => state.navigation.indiDevice;
const getVisibleGroup = state => state.navigation.indiGroup ? state.navigation.indiGroup : 'Main Control';

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


