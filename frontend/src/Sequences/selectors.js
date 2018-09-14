import { createSelector } from 'reselect';
import { list2object, filterChildren } from '../utils'; 


export const getSequenceIds = state => state.sequences.ids;
export const getSequenceEntities = state => state.sequences.entities;
export const getSequenceJobs = state => state.sequenceJobs;

export const getSequences = createSelector([getSequenceIds, getSequenceEntities], (ids, entities) => {
  return ids.map(id => entities[id])
});

export const getSequenceEntitiesWithJobs = createSelector([getSequences, getSequenceJobs], (sequences, jobs) =>
    list2object(sequences.map(s => ({...s, sequenceJobEntities: filterChildren(jobs, i => i.sequence === s.id) }) ), 'id')
);
