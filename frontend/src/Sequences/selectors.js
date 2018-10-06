import { createSelector } from 'reselect';
import { list2object, filterChildren } from '../utils'; 


export const getSequenceIds = state => state.sequences.ids;

const sequenceGearConnected = (gear) => gear &&  
                                (!gear.camera || gear.camera.connected) &&
                                (!gear.filterWheel || gear.filterWheel.connected);



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
export const getSequenceJobs = state => state.sequenceJobs;

export const getSequences = createSelector([getSequenceIds, getSequenceEntities], (ids, entities) => {
  return ids.map(id => entities[id])
});

export const getSequenceEntitiesWithJobs = createSelector([getSequences, getSequenceJobs], (sequences, jobs) =>
    list2object(sequences.map(s => ({...s, sequenceJobEntities: filterChildren(jobs, i => i.sequence === s.id) }) ), 'id')
);
