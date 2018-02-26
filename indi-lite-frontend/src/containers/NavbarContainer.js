import { connect } from 'react-redux'
import INDINavbar from '../components/INDINavbar'
import { navigateToSection } from '../actions'

const mapStateToProps = state => {
  return {
    section: state.navigation.section
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSelected: section => dispatch(navigateToSection(section))
  }
}


const NavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDINavbar)

export default NavbarContainer 


