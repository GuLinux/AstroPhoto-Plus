import { createSelector } from 'reselect';
import { getDevices } from '../INDI-Server/selectors';
import { getSequenceJobs, getJobsForSequence } from '../SequenceJobs/selectors';
import { imageUrlBuilder } from '../utils';

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
    state => getSequenceJobs(state).length
], (sequence, gear, sequenceJobsLength) => {
    return {
        sequence,
        gear,
        sequenceJobsLength,
        ...getSequenceStatus(sequence, gear),
    }
});




export const sequenceSelector = (sequenceId) => createSelector([
    getSequence(sequenceId),
], (sequence) => {
    return {
        sequence,
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
