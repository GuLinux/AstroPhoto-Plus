import { connect } from 'react-redux'
import AddSequenceModal from '../components/AddSequenceModal'
import Actions from '../actions'

const mapStateToProps = state => {
  return {
    cameras: state.gear.cameras.map(id => state.gear.cameraEntities[id])
  }
}


const mapDispatchToProps = dispatch => {
  return {
    onAddSequence: (sequenceName, cameraID) => dispatch(Actions.Sequences.add(sequenceName, cameraID))
  }
}

const AddSequenceModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSequenceModal)

export default AddSequenceModalContainer
