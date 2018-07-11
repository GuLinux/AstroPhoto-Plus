import { connect } from 'react-redux'
import Navbar from './Navbar'
import Actions from '../actions'
import { hasConnectedCameras } from '../Gear/selectors'

const mapStateToProps = state => ({
    disabled: state.errors.isError,
    hasConnectedCameras: hasConnectedCameras(state),
})

const mapDispatchToProps = dispatch => ({})


const NavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)

export default NavbarContainer
