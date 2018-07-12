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
    onSequenceDelete: (sequenceId) => dispatch(Actions.Sequences.remove(sequenceId)),
    startSequence: (sequence) => dispatch(Actions.Sequences.start(sequence)),
    duplicateSequence: (sequence) => dispatch(Actions.Sequences.duplicate(sequence)),
    onMount: (items) => dispatch(Actions.Navigation.setRightMenu(items)),
    onUnmount: () => dispatch(Actions.Navigation.resetRightMenu()),
  }
}

const SequencesListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SequencesList)

export default SequencesListContainer
