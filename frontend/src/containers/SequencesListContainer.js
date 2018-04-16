import { connect } from 'react-redux'
import SequencesList from '../components/SequencesList'
import Actions from '../actions'

const getSequences = (entities, ids) => {
  return ids.map(id => entities[id])
}

const mapStateToProps = state => {

    let cameras = state.gear.cameras.reduce( (cameras, id) => ({...cameras, [id]: state.gear.cameraEntities[id].device.name }), {} );

    return {
        sequences: getSequences(state.sequences.entities, state.sequences.ids),
        cameras,
    }
}

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

