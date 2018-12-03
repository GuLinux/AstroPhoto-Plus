import { getDeviceEntities, getDevicesProperties, getDevicesConnectionState } from '../INDI-Server/selectors'
import { createSelector } from 'reselect'
import { list2object } from '../utils';

export const getSequences = state => state.sequences;

export const getGear = state => state.gear

const isDeviceConnected = (devicesProperties, deviceID) => {
    if(!(deviceID in devicesProperties))
        return false;
    let deviceProperties = devicesProperties[deviceID]
    if(! ('CONNECTION' in deviceProperties))
        return false;
    let connectionProperty = deviceProperties.CONNECTION;
    return !! connectionProperty.values.find(value => value.name === 'CONNECT' && value.value);
}

const buildBaseObject = (deviceEntities, devicesProperties, deviceID) => {
    let device = { id: deviceID }
    if(deviceID in deviceEntities)
        device.name = deviceEntities[deviceID].name;
    device.connected = isDeviceConnected(devicesProperties, deviceID)
    return device;
}

const buildCamera = (deviceEntities, devicesProperties, cameraID) => {
    let camera = buildBaseObject(deviceEntities, devicesProperties, cameraID);
    if(camera.connected) {
        camera.exposureProperty = devicesProperties[cameraID].CCD_EXPOSURE;
        camera.abortExposureProperty = devicesProperties[cameraID].CCD_ABORT_EXPOSURE;
        camera.ccdInformation = list2object(devicesProperties[cameraID].CCD_INFO.values, 'name');
    }
    return camera
}

const buildTelescope = (deviceEntities, deviceProperties, telescopeId) => {
    let telescope = buildBaseObject(deviceEntities, deviceProperties, telescopeId);
    if(telescope.connected) {
        telescope.info = list2object(deviceProperties[telescopeId].TELESCOPE_INFO.values, 'name');
    }
    return telescope;
}

const buildAstrometry = (deviceEntities, deviceProperties, astrometryId) => {
    let astrometry = buildBaseObject(deviceEntities, deviceProperties, astrometryId);
    return astrometry;
}

const buildFilterWheel = (deviceEntities, devicesProperties, filterWheelID) => {
    let filterWheel = buildBaseObject(deviceEntities, devicesProperties, filterWheelID);
    if(filterWheel.connected) {
        filterWheel.filterNameProperty = devicesProperties[filterWheelID].FILTER_NAME;
        filterWheel.filterSlotProperty = devicesProperties[filterWheelID].FILTER_SLOT;
        if(filterWheel.filterNameProperty && filterWheel.filterSlotProperty) {
            filterWheel.filters = filterWheel.filterNameProperty.values.map( (value, index) => ({ number: index+1, name: value.value}) );
            filterWheel.names2numbers = filterWheel.filters.reduce( (mapping, filter) => ({...mapping, [filter.name]: filter.number}), {});
            filterWheel.numbers2names = filterWheel.filters.reduce( (mapping, filter) => ({...mapping, [filter.number]: filter.name}), {});
            let filterSlot = filterWheel.filterSlotProperty.values[0].value;
            filterWheel.currentFilter = { number: filterSlot, name: filterWheel.numbers2names[filterSlot] }
        }
    }
    return filterWheel
}


const buildGear = (deviceEntities, devicesProperties, sequence) => {
    let gear = { sequence: sequence.id };
    if(sequence.camera)
        gear.camera = buildCamera(deviceEntities, devicesProperties, sequence.camera);
    if(sequence.filterWheel)
        gear.filterWheel = buildFilterWheel(deviceEntities, devicesProperties, sequence.filterWheel);
    return gear;
}

const buildGearList = (ids, entities) => ({
    ids,
    entities,
    length: ids.length,
    all: ids.map(id => entities[id]),
    at: index => entities[ids[index]],
    get: id => entities[id],
});

export const getSequencesGears = createSelector([getDeviceEntities, getDevicesProperties, getSequences, getDevicesConnectionState], (deviceEntities, devicesProperties, sequences, devicesConnectionState) => {
    return sequences.ids.reduce( (gears, sequenceID) => ({...gears, [sequenceID]: buildGear(deviceEntities, devicesProperties, sequences.entities[sequenceID]) }), {});
})

const getConnectedCameras = createSelector([getGear], (gear) => gear.cameras.filter(c => gear.cameraEntities[c].connected));
const getConnectedCameraEntities = createSelector([getConnectedCameras, getDeviceEntities, getDevicesProperties],
    (connectedCameras, deviceEntities, deviceProperties) => list2object(connectedCameras.map(c => buildCamera(deviceEntities, deviceProperties, c) ), 'id'));

export const connectedCamerasSelector = createSelector([getConnectedCameras, getConnectedCameraEntities], buildGearList);




const getConnectedFilterWheels = createSelector([getGear], (gear) => gear.filterWheels.filter(c => gear.filterWheelEntities[c].connected));
const getConnectedFilterWheelEntities = createSelector([getConnectedFilterWheels, getDeviceEntities, getDevicesProperties],
    (connectedFilterWheels, deviceEntities, deviceProperties) => list2object(connectedFilterWheels.map(c => buildFilterWheel(deviceEntities, deviceProperties, c) ), 'id'));

export const connectedFilterWheelsSelector = createSelector([getConnectedFilterWheels, getConnectedFilterWheelEntities], buildGearList);

const getConnectedAstrometry = createSelector([getGear], (gear) => gear.astrometry.filter(c => gear.astrometryEntities[c].connected));
const getConnectedAstrometryEntities = createSelector([getConnectedAstrometry, getDeviceEntities, getDevicesProperties],
    (connectedAstrometry, entities, properties) => 
        list2object(connectedAstrometry.map(c => buildAstrometry(entities, properties, c)), 'id')
);

export const connectedAstrometrySelector = createSelector([getConnectedAstrometry, getConnectedAstrometryEntities], buildGearList);

const getConnectedTelescopes= createSelector([getGear], (gear) => gear.telescopes.filter(c => gear.telescopeEntities[c].connected));
const getConnectedTelescopeEntities = createSelector([getConnectedTelescopes, getDeviceEntities, getDevicesProperties],
    (connectedTelescopes, entities, properties) => 
        list2object(connectedTelescopes.map(c => buildTelescope(entities, properties, c)), 'id')
);

export const connectedTelescopesSelector = createSelector([getConnectedTelescopes, getConnectedTelescopeEntities], buildGearList);

export const gearSelector = createSelector([
    connectedAstrometrySelector,
    connectedCamerasSelector,
    connectedFilterWheelsSelector,
    connectedTelescopesSelector,
], (astrometry, cameras, filterWheels, telescopes) => ({
    astrometry,
    cameras,
    filterWheels,
    telescopes,
}))
