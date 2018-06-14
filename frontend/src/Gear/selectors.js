import { getDeviceEntities, getDevicesProperties, getDevicesConnectionState } from '../INDI-Server/selectors'
import { createSelector } from 'reselect'

export const getSequences = state => state.sequences;
export const getSequenceItems = state => state.sequenceItems;

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
    }
    return camera
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

export const getGears = createSelector([getDeviceEntities, getDevicesProperties, getSequences, getDevicesConnectionState], (deviceEntities, devicesProperties, sequences, devicesConnectionState) => {
    return sequences.ids.reduce( (gears, sequenceID) => ({...gears, [sequenceID]: buildGear(deviceEntities, devicesProperties, sequences.entities[sequenceID]) }), {});
})


export const connectedCameras = createSelector([getGear], (gear) => gear.cameras.filter(c => gear.cameraEntities[c].connected));

export const hasConnectedCameras = createSelector([connectedCameras], (cameraIds) => cameraIds.length > 0)
