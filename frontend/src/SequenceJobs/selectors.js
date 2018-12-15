import { createSelector } from 'reselect';
import { getSequence } from '../Sequences/selectors';

export const getSequenceJobs = state => state.sequenceJobs;
export const getSequenceJob = (state, {sequenceJobId}) => state.sequenceJobs[sequenceJobId];

export const getJobsForSequence = (sequenceId) => createSelector([
    getSequenceJobs,
    getSequence(sequenceId),
], (sequenceJobs, sequence) => sequence ? sequence.sequenceJobs.map(job => sequenceJobs[job]) : []);


/*

const sequenceJobViewModel = (state, sequenceJob) => ({
    ...sequenceJob,
    typeLabel: getTypeLabel(sequenceJob.type),
    description: getDescription(state, sequenceJob),
})


const getTypeLabel = type => {
    switch(type) {
        case 'shots':
            return 'Exposures';
        case 'filter':
            return 'Filter Wheel';
        case 'command':
            return 'Run command'
        case 'property':
            return 'Change property'
        default:
            return '';
    }
}

const getDescription = (state, sequenceJob) => {
    switch(sequenceJob.type) {
        case 'shots':
            return `${sequenceJob.count} shots of ${sequenceJob.exposure} seconds, ${sequenceJob.count * sequenceJob.exposure} seconds total`;
        case 'filter':
            let gear = getSequencesGears(state)[sequenceJob.sequence];
            if(gear.filterWheel.connected)
                return `Set filter wheel to filter ${gear.filterWheel.numbers2names[sequenceJob.filterNumber]} (${sequenceJob.filterNumber})`
            return `Set filter wheel to filter ${sequenceJob.filterNumber}`
        case 'command':
            return `Run command: ${sequenceJob.command}`
        case 'property':
            return `Change INDI property ${sequenceJob.property} on ${sequenceJob.device}`
        default:
            return '';
    }
}

*/


export const sequenceJobsListSelector = (sequenceId) => createSelector([
    getJobsForSequence(sequenceId),
], (sequenceJobs) => {
    return {
        sequenceJobs,
    };
});
