import { connect } from 'react-redux'
import AddSequenceModal from './AddSequenceModal'
import Actions from '../actions'

const mapStateToProps = state => {
  return {
    cameras: state.gear.cameras.map(id => state.gear.cameraEntities[id]),
    filterWheels: state.gear.filterWheels.map(id => state.gear.filterWheelEntities[id]),
  }
}


const mapDispatchToProps = {
    onAddSequence: Actions.Sequences.add,
    onEditSequence: Actions.Sequences.edit,
}

const AddSequenceModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSequenceModal)

export default AddSequenceModalContainer
