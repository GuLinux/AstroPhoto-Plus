import { connect } from 'react-redux'
import AddSessionModal from '../components/AddSessionModal'
import Actions from '../actions'

const mapStateToProps = state => {
  return {
    cameras: state.gear.cameras.map(id => state.gear.cameraEntities[id])
  }
}


const mapDispatchToProps = dispatch => {
  return {
    onAddSession: (sessionName, cameraID) => dispatch(Actions.Sessions.add(sessionName, cameraID))
  }
}

const AddSessionModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSessionModal)

export default AddSessionModalContainer
