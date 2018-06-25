import { createSelector } from 'reselect';
import { list2object, filterChildren } from '../utils'; 


export const getSequenceIds = state => state.sequences.ids;
export const getSequenceEntities = state => state.sequences.entities;
export const getSequenceItems = state => state.sequenceItems;

export const getSequences = createSelector([getSequenceIds, getSequenceEntities], (ids, entities) => {
  return ids.map(id => entities[id])
});

export const getSequenceEntitiesWithItems = createSelector([getSequences, getSequenceItems], (sequences, items) =>
    list2object(sequences.map(s => ({...s, sequenceItemEntities: filterChildren(items, i => i.sequence === s.id) }) ), 'id')
);
