import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { getDevices } from '../INDI-Server/selectors';
import { getJobsForSequence } from '../SequenceJobs/selectors';
import { imageUrlBuilder, formatDecimalNumber } from '../utils';
import { secs2time } from '../utils';
import {
    getConnectedCameras,
    getConnectedFilterWheels,
    getCameraExposureValue,
    getCameraExposureProperty,
    getFilterWheelCurrentFilter,
    getFilterWheelCurrentFilterName,
    getCameraTempProperty,
    getCameraTempValue,
} from '../Gear/selectors';
import { getSequenceIds, getSequenceId, getSequence, getShowLastImage } from './inputSelectors';
import { get } from 'lodash';



export const sequenceListSelector = createSelector([getSequenceIds], (sequences) => ({
    sequences,
}));


const getSequenceGear = createCachedSelector([
    getSequence,
    getDevices,
],
    (sequence, devices) => sequence ? {
            camera: devices.entities[sequence.camera],
            filterWheel: sequence.filterWheel && devices.entities[sequence.filterWheel],
        } : {}
)(getSequenceId); 

export const getCanReset = (sequence) => sequence.status !== 'running';

const getSequenceStatus = (sequence, gear) => {
    if(!sequence) {
        return null;
    }
    const gearConnected = gear.camera && gear.camera.connected && (!sequence.filterWheel || (gear.filterWheel && gear.filterWheel.connected));
    const canStart = gearConnected && ['idle', 'stopped', 'error'].includes(sequence.status);
    const canStop = sequence.status === 'running' || sequence.status === 'stale';
    const canEdit = gearConnected && ['idle', 'error'].includes(sequence.status);
    const canReset = getCanReset(sequence);
    return { canStart, canStop, canEdit, canReset };
};


const sequenceHasFiles = createCachedSelector([getJobsForSequence],
    sequenceJobs => sequenceJobs.reduce( (hasFiles, sequenceJob) => hasFiles || sequenceJob.has_files, false )
)(getSequenceId);


export const getSequenceListItemSelector = createCachedSelector([
    getSequence,
    getSequenceGear,
    sequenceHasFiles,
], (sequence, gear, hasFiles) => {
    return {
        sequence,
        gear,
        hasFiles,
        ...getSequenceStatus(sequence, gear),
    }
})(getSequenceId);


export const sequenceSelector = createCachedSelector([
    getSequence,
    getSequenceGear,
], (sequence, gear) => {
    return {
        sequence,
        ...getSequenceStatus(sequence, gear),
    };
})(getSequenceId);


export const sequenceSectionMenuSelector = createCachedSelector([
    getSequence,
    getSequenceGear,
    sequenceHasFiles,
], (sequence, gear, hasFiles) => {
    return {
        sequence,
        gear,
        hasFiles,
        ...getSequenceStatus(sequence, gear),
    };
})(getSequenceId);


export const lastCapturedSequenceImageSelector = createCachedSelector([
    getJobsForSequence,
    getShowLastImage,
], (sequenceJobs, showLastImage) => {
    if(!sequenceJobs) {
        return { showLastImage };
    }
    const images = sequenceJobs
        .filter(i => i.type === 'shots' && i.saved_images)
        .map(i => ({ sequenceJob: i.id, savedImages: i.saved_images}) )
        .reduce( (acc, cur) => [...acc, ...cur.savedImages], []);

    const type = 'main';
    const lastImageId = images.slice(-1)[0];
    const lastImage = images.length > 0 ? imageUrlBuilder(lastImageId, {
        type,
        maxWidth: 723,
        stretch: true,
        clipLow: 0,
        clipHigh: 0,
    }) : null;

    return { showLastImage, type, lastImage, lastImageId };
})(getSequenceId);


export const exposuresCardSelector = createCachedSelector([getJobsForSequence], sequenceJobs => {
    const exposureSequenceJobs = sequenceJobs.filter(s => s.type === 'shots');
    const remapped = exposureSequenceJobs.map(s => ({
        count: s.count,
        shot: s.progress,
        remaining: s.count - s.progress,
        totalTime: s.count * s.exposure,
        elapsed: s.progress * s.exposure,
        timeRemaining: s.exposure * (s.count - s.progress),
    }));
    const computeTotal = (prop) => remapped.reduce( (cur, val) => cur + val[prop], 0);
    return {
        exposureJobsCount: exposureSequenceJobs.length,
        totalShots: computeTotal('count'),
        totalTime: secs2time(computeTotal('totalTime')),
        completedShots: computeTotal('shot'),
        completedTime: secs2time(computeTotal('elapsed')),
        remainingShots: computeTotal('remaining'),
        remainingTime: secs2time(computeTotal('timeRemaining')),
    }
})(getSequenceId);


const getCameraIdProp = (state, {cameraId}) => cameraId;

const getSequenceCameraExposureDevice = createCachedSelector([
    (state, {cameraId}) => get(getDevices(state), ['entities', cameraId]),
], camera => camera)(getCameraIdProp);


export const cameraDetailsCardSelector = createCachedSelector([
    getSequenceCameraExposureDevice,
    getCameraExposureProperty,
    getCameraExposureValue,
    getCameraTempProperty,
    getCameraTempValue,
], (camera, exposureProperty, exposure, temperatureProperty, temperature) => ({
    camera,
    exposureProperty,
    exposure: exposure ? formatDecimalNumber(exposure.format, exposure.value) : 'N/A',
    temperatureProperty,
    temperature: temperature ? formatDecimalNumber(temperature.format, temperature.value) : 'N/A',
}))(getSequenceId);

export const addSequenceModalSelector = createSelector([
    getDevices,
    getConnectedCameras,
    getConnectedFilterWheels,
], (devices, cameras, filterWheels) => ({
    cameras: cameras.map(c => devices.entities[c]),
    filterWheels: filterWheels.map(f => devices.entities[f]),
}) );



const getSequenceFilterWheelDevice = createSelector([
    (state, {filterWheelId}) => get(getDevices(state), ['entities', filterWheelId])
], filterWheel => filterWheel);


export const filterWheelCardSelector = createSelector([
    getSequenceFilterWheelDevice,
    getFilterWheelCurrentFilterName,
    getFilterWheelCurrentFilter,
], (filterWheel, filterNameValue, filterNumberValue) => ({
    filterWheel,
    filterName: get(filterNameValue, 'value', 'N/A'),
    filterNumber: get(filterNumberValue, 'value', 'N/A'),
}));
