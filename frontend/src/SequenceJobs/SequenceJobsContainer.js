import { connect } from 'react-redux'
import SequenceJobsList from './SequenceJobsList'
import Actions from '../actions'
import { getSequencesGears } from '../Gear/selectors'

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

const sequenceJobViewModel = (state, sequenceJob) => ({
    ...sequenceJob,
    typeLabel: getTypeLabel(sequenceJob.type),
    description: getDescription(state, sequenceJob),
})

const mapStateToProps = (state, ownProps) => {
  let sequence = state.sequences.entities[ownProps.sequenceId];
  return {
    sequenceJobs: sequence.sequenceJobs.map(id => sequenceJobViewModel(state, state.sequenceJobs[id]))
  }
}

const mapDispatchToProps = {
    deleteSequenceJob: Actions.SequenceJobs.delete,
    moveSequenceJob: Actions.SequenceJobs.move,
    duplicateSequenceJob: Actions.SequenceJobs.duplicate,
}

const SequenceJobsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)( () => null /* SequenceJobsList */ )

export default SequenceJobsContainer
