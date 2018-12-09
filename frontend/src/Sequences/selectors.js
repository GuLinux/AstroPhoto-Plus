import { createSelector } from 'reselect';
import { getDevices } from '../INDI-Server/selectors';

const getSequenceIds = state => state.sequences.ids;


const getSequenceJobs = state => state.sequenceJobs;


export const sequenceListSelector = createSelector([getSequenceIds], (sequences) => ({
    sequences,
}));


const getSequence = (sequenceId) => state => state.sequences.entities[sequenceId];

const getSequenceGear = (sequenceId) => createSelector([getSequence(sequenceId), getDevices],
    (sequence, devices) => ({
        camera: devices.entities[sequence.camera],
        filterWheel: sequence.filterWheel && devices.entities[sequence.filterWheel],
})); 

export const getSequenceListItemSelector = (sequenceId) => createSelector([
    getSequence(sequenceId),
    getSequenceGear(sequenceId),
    state => getSequenceJobs(state).length
], (sequence, gear, sequenceJobsLength) => {
    const gearConnected = gear.camera && gear.camera.connected && (!sequence.filterWheel || (gear.filterWheel && gear.filterWheel.connected));
    const canStop = sequence.status === 'running';
    const canEdit = gearConnected && ['idle', 'error'].includes(sequence.status);
    const canReset = sequence.status === 'running';
    return {
        sequence,
        gear,
        sequenceJobsLength,
        canStart: gearConnected,
        canStop,
        canEdit,
        canReset,
    }
});


export const getSequenceEntitiesWithJobs = (...args) => console.log(args); // TODO: remove
