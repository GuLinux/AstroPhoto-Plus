import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { getSequenceId, getSequence } from '../Sequences/inputSelectors';
import { get } from 'lodash';
import { getSequenceGear } from '../Sequences/selectors';
import { getPropertyId, getValueId } from '../INDI-Server/utils';
import { getValueInputSelector, getValueInputSelectorById } from '../INDI-Server/selectors';
import { getFilterWheelAvailableFiltersProperty } from '../Gear/selectors';


export const getSequenceJobs = state => state.sequenceJobs;
export const getSequenceJob = (state, {sequenceJobId}) => state.sequenceJobs[sequenceJobId];
const getSequenceJobId = (state, {sequenceJobId}) => sequenceJobId;

export const getJobsForSequence = createCachedSelector([
    getSequenceJobs,
    getSequence,
], (sequenceJobs, sequence) => sequence ? sequence.sequenceJobs.map(job => sequenceJobs[job]) : [])(getSequenceId);

export const sequenceJobSelector = createCachedSelector([
    getSequenceJob,
], (sequenceJob) => ({
    sequenceJob,
}))(getSequenceJobId);



const sequenceJobViewModel = (sequenceJob) => ({
    ...sequenceJob,
    typeLabel: getTypeLabel(sequenceJob.type),
    description: getDescription(sequenceJob),
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

const getDescription = (sequenceJob, filterName) => {
    switch(sequenceJob.type) {
        case 'shots':
            return `${sequenceJob.count} shots of ${sequenceJob.exposure} seconds, ${sequenceJob.count * sequenceJob.exposure} seconds total`;
        case 'filter':
            return filterName ? `Set filter wheel to filter ${filterName} (${sequenceJob.filterNumber})` : `Set filter wheel to filter ${sequenceJob.filterNumber}`
        case 'command':
            return `Run command: ${sequenceJob.command}`
        case 'property':
            return `Change INDI property ${sequenceJob.property} on ${sequenceJob.device}`
        default:
            return '';
    }
}

const getSequenceForJob = (state, {sequenceJob}) => getSequence(state, {sequenceId: sequenceJob.sequence});

export const sequenceJobListItemSelector = createCachedSelector([
    getSequenceJob,
], sequenceJob => ({
    sequenceJob: sequenceJob && sequenceJobViewModel(sequenceJob),
}))(getSequenceJobId);    


export const sequenceJobsListSelector = createCachedSelector([
    getJobsForSequence,
], (sequenceJobs) => {
    return {
        sequenceJobs,
    };
})(getSequenceId);

const getSequenceJobPropId = (state, {sequenceJob}) => sequenceJob && sequenceJob.id;


const getExposureValue = (state, {sequenceJob}) => {
    const sequence = getSequenceForJob(state, {sequenceJob});
    return getValueInputSelector(sequence.camera, 'CCD_EXPOSURE', 'CCD_EXPOSURE_VALUE')(state);
}


export const exposureSequenceJobSelector = createCachedSelector([
    getSequenceForJob,
    getExposureValue,
], ({filterWheel}, exposureValue) => ({
    hasFilterWheel: !!filterWheel,
    exposureValue,
}))( getSequenceJobPropId )


const getFilterWheelAvailablePropertyForSequence = (state, {sequenceJob}) => {
    const sequence = getSequenceForJob(state, {sequenceJob});
    return getFilterWheelAvailableFiltersProperty(state, {filterWheelId: sequence.filterWheel});
}

export const filterWheelSequenceJobSelector = createCachedSelector([
    getFilterWheelAvailablePropertyForSequence,
], (availableFiltersProperty) => ({
    filters: availableFiltersProperty && availableFiltersProperty.values,
}))(getSequenceJobPropId);


export const filterSequenceJobItemSelector = createCachedSelector(
    [(state, {filterId}) => getValueInputSelectorById(state, {valueId: filterId})],
filter => ({ 
    filterName: filter.value,
    filterNumber: parseInt(filter.name.replace('FILTER_SLOT_NAME_', ''), 10),
})
)( (state, {filterId}) => filterId );
