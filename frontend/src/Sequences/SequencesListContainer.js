import { connect } from 'react-redux'
import SequencesList from './SequencesList'
import Actions from '../actions'
import { getSequencesGears } from '../Gear/selectors'

const getSequences = (entities, ids) => {
  return ids.map(id => entities[id])
}

const mapStateToProps = state => ({
    sequences: getSequences(state.sequences.entities, state.sequences.ids),
    gear: getSequencesGears(state),
})

const mapDispatchToProps = dispatch => {
  return {
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
