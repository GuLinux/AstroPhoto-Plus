import { createSelector } from 'reselect';
import { makeGetDeviceProperties } from './indi-properties';

const getProperties = state => state.indiserver.properties;
const getDevice = (state, props) => props.device;



export const makeGetDeviceGroups = () => {
    return createSelector([getProperties, getDevice], (properties, device) => {
        let deviceProperties = Object.keys(properties).map(p => properties[p]).filter(p => p.device === device);
        console.log(`doing getDeviceGroupsCalculation`);
        let groups = deviceProperties.map(p => p.group);
        groups = groups.filter( (group, index) => groups.indexOf(group) === index);
        return groups;
    })
}

