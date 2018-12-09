import { createSelector } from 'reselect';
import { list2object, filterChildren } from '../utils'; 
import { getDevices } from '../INDI-Server/selectors-redo';

const getSequenceIds = state => state.sequences.ids;

const sequenceGearConnected = (gear) => gear &&  
                                (!gear.camera || gear.camera.connected) &&
                                (!gear.filterWheel || gear.filterWheel.connected);


const getSequenceJobs = state => state.sequenceJobs;


export const getSequenceEntities = createSelector([state => state.sequences.entities], sequences => {
    const entities = {};
    Object.keys(sequences).forEach(id => entities[id] = {
        ...sequences[id],
        canStop: sequences[id].status === 'running',
        canStart: gear => gear &&
                            sequenceGearConnected(gear) &&
                            ['idle', 'stopped', 'error'].includes(sequences[id].status) &&
                            !! sequences[id].sequenceJobs.length,
        canEdit: gear => gear &&
                            sequenceGearConnected(gear) && 
                            ['idle', 'error'].includes(sequences[id].status),
        canReset: sequences[id].status !== 'running',

    });
    return entities;
});


export const getSequences = createSelector([getSequenceIds, getSequenceEntities], (ids, entities) => {
  return ids.map(id => entities[id])
});

export const getSequenceEntitiesWithJobs = createSelector([getSequences, getSequenceJobs], (sequences, jobs) =>
    list2object(sequences.map(s => ({...s, sequenceJobEntities: filterChildren(jobs, i => i.sequence === s.id) }) ), 'id')
);



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

