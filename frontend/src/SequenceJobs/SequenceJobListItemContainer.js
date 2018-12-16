import { connect } from 'react-redux'
import Actions from '../actions'
import { SequenceJobListItem } from './SequenceJobListItem';
import { sequenceJobListItemSelector } from './selectors';

const mapDispatchToProps = {
    deleteSequenceJob: Actions.SequenceJobs.delete,
    moveSequenceJob: Actions.SequenceJobs.move,
    duplicateSequenceJob: Actions.SequenceJobs.duplicate,
}

export const SequenceJobsListItemContainer = connect(
    sequenceJobListItemSelector,
    mapDispatchToProps,
)(SequenceJobListItem);

