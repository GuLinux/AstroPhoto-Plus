import { connect } from 'react-redux'
import INDINavbar from '../components/INDINavbar'
import { navigateToSecton } from '../actions'

const mapStateToProps = state => {
  return {
    section: state.navigation.section
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSelected: section => dispatch(navigateToSecton(section))
  }
}


const NavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDINavbar)

export default NavbarContainer 


