import { getDevices } from '../INDI-Server/selectors';
import { createSelector } from 'reselect'
import { transform } from 'lodash';

const filterConnectedDevices = (devices, predicate) => devices.ids.filter(
    id => {
        const device = devices.entities[id];
        return device.connected && predicate(device);
    }
);

export const getConnectedCameras = createSelector([getDevices], (devices) => filterConnectedDevices(devices, d => d.interfaces.includes('ccd')));
export const getConnectedTelescopes = createSelector([getDevices], (devices) => filterConnectedDevices(devices, d => d.interfaces.includes('telescope')));
export const getConnectedFilterWheels = createSelector([getDevices], (devices) => filterConnectedDevices(devices, d => d.interfaces.includes('filter')));
export const getConnectedAstrometry = createSelector([getDevices], (devices) => filterConnectedDevices(devices, d => d.name.toLowerCase().includes('astrometry')));

export const filterDevices = (devices, ids) => ({
    ids,
    entities: transform(ids, (result, id) => result[id] = devices.entities[id], {}),
    length: ids.length,
});


// TODO: remove
const nullF = (...args) => console.log('TODO: remove', args);
export const connectedAstrometrySelector = nullF;
export const connectedCamerasSelector = nullF;
export const connectedFilterWheelsSelector = nullF;
export const connectedTelescopesSelector = nullF;
export const getSequencesGears = nullF;
