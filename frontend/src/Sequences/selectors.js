import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { getDevices, getProperties, getValues } from '../INDI-Server/selectors';
import { getJobsForSequence } from '../SequenceJobs/selectors';
import { imageUrlBuilder, formatDecimalNumber } from '../utils';
import { secs2time } from '../utils';
import { getConnectedCameras, getConnectedFilterWheels } from '../Gear/selectors';
import { getSequenceIds, getSequenceId, getSequence, getShowLastImage } from './inputSelectors';
import { getPropertyId, getValueId } from '../INDI-Server/utils';
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


const getSequenceStatus = (sequence, gear) => {
    if(!sequence) {
        return null;
    }
    const gearConnected = gear.camera && gear.camera.connected && (!sequence.filterWheel || (gear.filterWheel && gear.filterWheel.connected));
    const canStart = gearConnected && ['idle', 'stopped', 'error'].includes(sequence.status);
    const canStop = sequence.status === 'running';
    const canEdit = gearConnected && ['idle', 'error'].includes(sequence.status);
    const canReset = sequence.status !== 'running';
    return { canStart, canStop, canEdit, canReset };
};

export const getSequenceListItemSelector = createCachedSelector([
    getSequence,
    getSequenceGear,
], (sequence, gear) => {
    return {
        sequence,
        gear,
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
], (sequence, gear) => {
    return {
        sequence,
        gear,
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

const getSequenceCameraExposureProperty = createCachedSelector([
    (state, {cameraId}) => get(getProperties(state), ['entities', getPropertyId(cameraId, 'CCD_EXPOSURE')]),
], property => property)(getCameraIdProp);


const getSequenceCameraExposureValue = createCachedSelector([
    (state, {cameraId}) => get(getValues(state), ['entities', getValueId({device: cameraId, name: 'CCD_EXPOSURE'}, {name: 'CCD_EXPOSURE_VALUE'})]),
], (value) => value)(getSequenceId);

export const cameraDetailsCardSelector = createCachedSelector([
    getSequenceCameraExposureDevice,
    getSequenceCameraExposureProperty,
    getSequenceCameraExposureValue,
], (camera, property, value) => ({
    camera,
    property,
    value: value ? formatDecimalNumber(value.format, value.value) : 'N/A',
}))(getSequenceId);

export const addSequenceModalSelector = createSelector([
    getDevices,
    getConnectedCameras,
    getConnectedFilterWheels,
], (devices, cameras, filterWheels) => ({
    cameras: cameras.map(c => devices.entities[c]),
    filterWheels: filterWheels.map(f => devices.entities[f]),
}) );


const getFilterWheelId = (state, {filterWheelId}) => filterWheelId;

const getSequenceFilterWheelDevice = createCachedSelector([
    (state, {filterWheelId}) => get(getDevices(state), ['entities', filterWheelId])
], filterWheel => filterWheel)(getFilterWheelId);


const getCurrentFilterNumber = (state, {filterWheelId}) => get(getValues(state),
    ['entities', getValueId({device: filterWheelId, name: 'FILTER_SLOT'}, {name: 'FILTER_SLOT_VALUE'})],
    { value: 'N/A'}
).value;

const getCurrentFilterName = (state, {filterWheelId}) => get(getValues(state),
    ['entities', getValueId({device: filterWheelId, name: 'FILTER_NAME'}, { name: `FILTER_SLOT_NAME_${getCurrentFilterNumber(state, {filterWheelId})}` })],
    { value: 'N/A'}
).value;


export const filterWheelCardSelector = createCachedSelector([
    getSequenceFilterWheelDevice,
    getCurrentFilterName,
    getCurrentFilterNumber,
], (filterWheel, filterName, filterNumber) => ({
    filterWheel,
    filterName,
    filterNumber,
}))(getFilterWheelId);