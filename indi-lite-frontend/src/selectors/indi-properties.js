import { createSelector } from 'reselect'

const getProperties = state => state.indiserver.properties;
const getDevice = (state, props) => props.device;
const getGroup = (state, props) => props.group


export const makeGetDeviceProperties = () => createSelector([getDevice, getProperties, getGroup], (device, properties, group) => {
    let filteredIDS = Object.keys(properties).filter(id => properties[id].device === device && properties[id].group === group);
    return filteredIDS.map(id => properties[id])
})

