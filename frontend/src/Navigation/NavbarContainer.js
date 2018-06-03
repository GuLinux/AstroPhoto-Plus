import { connect } from 'react-redux'
import Navigation from './Navigation'
import Actions from '../actions'

const mapStateToProps = state => ({
    section: state.navigation.section,
    disabled: state.errors.isError,
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


