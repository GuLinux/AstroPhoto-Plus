import { createSelector } from 'reselect';
import { getSequence } from '../Sequences/selectors';

export const getSequenceJobs = state => state.sequenceJobs;
export const getSequenceJob = (state, {sequenceJobId}) => state.sequenceJobs[sequenceJobId];

export const getJobsForSequence = (sequenceId) => createSelector([
    getSequenceJobs,
    getSequence(sequenceId),
], (sequenceJobs, sequence) => sequence && sequence.sequenceJobs.map(job => sequenceJobs[job]));
