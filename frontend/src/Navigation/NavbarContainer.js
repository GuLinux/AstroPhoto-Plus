import { connect } from 'react-redux'
import Navigation from './Navigation'
import Actions from '../actions'
import { hasConnectedCameras } from '../Gear/selectors'

const mapStateToProps = state => ({
    disabled: state.errors.isError,
    hasConnectedCameras: hasConnectedCameras(state),
})

const mapDispatchToProps = dispatch => {
  return {
    onSelected: section => dispatch(Actions.Navigation.toSection(section))
  }
}


const NavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation)

export default NavbarContainer
