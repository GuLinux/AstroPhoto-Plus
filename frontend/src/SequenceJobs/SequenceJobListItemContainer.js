import { connect } from 'react-redux'
import Actions from '../actions'
import { sequenceJobsListItemSelector } from './selectors';
import { SequenceJobListItem } from './SequenceJobListItem';

const mapStateToProps = (state, ownProps) => {
    return sequenceJobsListItemSelector(ownProps.SequenceJobId)(state);
    /*
  let sequence = state.sequences.entities[ownProps.sequenceId];
  return {
    sequenceJobs: sequence.sequenceJobs.map(id => sequenceJobViewModel(state, state.sequenceJobs[id]))
  }
  */
}

const mapDispatchToProps = {
    deleteSequenceJob: Actions.SequenceJobs.delete,
    moveSequenceJob: Actions.SequenceJobs.move,
    duplicateSequenceJob: Actions.SequenceJobs.duplicate,
}

export const SequenceJobsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SequenceJobListItem);

