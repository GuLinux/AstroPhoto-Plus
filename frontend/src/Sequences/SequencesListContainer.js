import { connect } from 'react-redux';
import { SequencesList } from './SequencesList';
import Actions from '../actions';
import { getSequencesGears } from '../Gear/selectors';
import { getSequences } from './selectors';

const mapStateToProps = state => ({
    sequences: getSequences(state),
    gear: getSequencesGears(state),
})

const mapDispatchToProps = {
    onSequenceDelete: Actions.Sequences.remove,
    startSequence: Actions.Sequences.start,
    duplicateSequence: Actions.Sequences.duplicate,
    stopSequence: Actions.Sequences.stop,
    resetSequence: Actions.Sequences.reset,
}

const SequencesListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SequencesList)

export default SequencesListContainer
