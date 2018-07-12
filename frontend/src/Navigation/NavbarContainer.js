import { connect } from 'react-redux'
import Navbar from './Navbar'
import { hasConnectedCameras } from '../Gear/selectors'

const mapStateToProps = state => ({
    disabled: state.errors.isError,
    hasConnectedCameras: hasConnectedCameras(state),
    rightMenu: state.navigation.rightMenu,
})

const mapDispatchToProps = dispatch => ({})


const NavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)

export default NavbarContainer
