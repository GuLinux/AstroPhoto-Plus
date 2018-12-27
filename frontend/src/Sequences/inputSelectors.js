export const getSequenceIds = state => state.sequences.ids;
export const getSequenceId = (state, {sequenceId}) => sequenceId
export const getSequence = (state, {sequenceId}) => state.sequences.entities[sequenceId];
export const getShowLastImage = state =>  state.sequences.showLastImage;

