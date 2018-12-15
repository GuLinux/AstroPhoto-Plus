import { createSelector } from 'reselect';
import { getDevices, getProperties, getValues } from '../INDI-Server/selectors';
import { getJobsForSequence } from '../SequenceJobs/selectors';
import { imageUrlBuilder, formatDecimalNumber } from '../utils';
import { secs2time } from '../utils';

const getSequenceIds = state => state.sequences.ids;
export const getSequence = (sequenceId) => state => state.sequences.entities[sequenceId];


export const sequenceListSelector = createSelector([getSequenceIds], (sequences) => ({
    sequences,
}));




const getSequenceGear = (sequenceId) => createSelector([getSequence(sequenceId), getDevices],
    (sequence, devices) => sequence ? {
        camera: devices.entities[sequence.camera],
        filterWheel: sequence.filterWheel && devices.entities[sequence.filterWheel],
} : {} ); 


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

export const getSequenceListItemSelector = (sequenceId) => createSelector([
    getSequence(sequenceId),
    getSequenceGear(sequenceId),
], (sequence, gear) => {
    return {
        sequence,
        gear,
        ...getSequenceStatus(sequence, gear),
    }
});




export const sequenceSelector = (sequenceId) => createSelector([
    getSequence(sequenceId),
    getSequenceGear(sequenceId),
], (sequence, gear) => {
    return {
        sequence,
        ...getSequenceStatus(sequence, gear),
    };
});


export const sequenceSectionMenuSelector = (sequenceId) => createSelector([
    getSequence(sequenceId),
    getSequenceGear(sequenceId),
], (sequence, gear) => {
    return {
        sequence,
        gear,
        ...getSequenceStatus(sequence, gear),
    };
});



const getShowLastImage = state =>  state.sequences.showLastImage;
export const lastCapturedSequenceImageSelector = (sequenceId) => createSelector([
    getJobsForSequence(sequenceId),
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
});


export const exposuresCardSelector = sequenceId => createSelector([getJobsForSequence(sequenceId)], sequenceJobs => {
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
});


const getSequenceCamera = sequenceId => createSelector([getSequenceGear(sequenceId)], gear => gear.camera);
const getSequenceCameraExposureProperty = sequenceId => createSelector([
    getSequenceCamera(sequenceId),
    getProperties,
],
    (camera, properties) => {
        if(!camera) {
            return null;
        }
        const propertyId = properties.ids.find(id => properties.entities[id].device === camera.id && properties.entities[id].name === 'CCD_EXPOSURE');
        return propertyId && properties.entities[propertyId];
});

const getSequenceCameraExposureValue = sequenceId => createSelector([
    getSequenceCameraExposureProperty(sequenceId),
    getValues,
], (property, values) => {
    if(!property) {
        return null;
    }
    const valueId = property.values.find(id => values.entities[id].name === 'CCD_EXPOSURE_VALUE');
    return values.entities[valueId];
});

export const cameraDetailsCardSelector = sequenceId => createSelector([
    getSequenceCamera(sequenceId),
    getSequenceCameraExposureProperty(sequenceId),
    getSequenceCameraExposureValue(sequenceId),
], (camera, property, value) => value ? {
    state: property.state,
    cameraConnected: camera.connected,
    cameraName: camera.name,
    value: formatDecimalNumber(value.format, value.value),
}: {});