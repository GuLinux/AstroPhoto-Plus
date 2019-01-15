import { connect } from 'react-redux';
import { SequencesList } from './SequencesList';
import { sequenceListSelector } from './selectors';

const SequencesListContainer = connect(
  sequenceListSelector,
)(SequencesList)

export default SequencesListContainer
