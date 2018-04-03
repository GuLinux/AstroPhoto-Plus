import { connect } from 'react-redux'
import INDINavbar from '../components/INDINavbar'
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
)(INDINavbar)

export default NavbarContainer 


