import { connect } from 'react-redux'
import SequencesList from '../components/SequencesList'
import Actions from '../actions'
import { getGears } from '../selectors/gear'

const getSequences = (entities, ids) => {
  return ids.map(id => entities[id])
}

const mapStateToProps = state => ({
    sequences: getSequences(state.sequences.entities, state.sequences.ids),
    gear: getGears(state),
})

const mapDispatchToProps = dispatch => {
  return {
    onSequenceEdit: (sequenceId) => dispatch(Actions.Navigation.toSequence('sequence', sequenceId)),
    onSequenceDelete: (sequenceId) => dispatch(Actions.Sequences.remove(sequenceId)),
    startSequence: (sequence) => dispatch(Actions.Sequences.start(sequence)),
    duplicateSequence: (sequence) => dispatch(Actions.Sequences.duplicate(sequence)),
  }
}

const SequencesListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SequencesList)

export default SequencesListContainer

