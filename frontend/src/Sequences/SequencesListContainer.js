import { connect } from 'react-redux';
import SequencesList from './SequencesList';
import Actions from '../actions';
import { getSequencesGears } from '../Gear/selectors';
import { getSequences } from './selectors';

const mapStateToProps = state => ({
    sequences: getSequences(state),
    gear: getSequencesGears(state),
})

const mapDispatchToProps = dispatch => {
  return {
    onSequenceDelete: (sequenceId, options) => dispatch(Actions.Sequences.remove(sequenceId, options)),
    startSequence: (sequence) => dispatch(Actions.Sequences.start(sequence)),
    duplicateSequence: (sequence) => dispatch(Actions.Sequences.duplicate(sequence)),
    onMount: (data) => dispatch(Actions.Navigation.setRightMenu(data)),
    onUnmount: () => dispatch(Actions.Navigation.resetRightMenu()),
    stopSequence: (sequence) => dispatch(Actions.Sequences.stop(sequence)),
    resetSequence: (sequence, options) => dispatch(Actions.Sequences.reset(sequence, options)),
  }
}

const SequencesListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SequencesList)

export default SequencesListContainer
