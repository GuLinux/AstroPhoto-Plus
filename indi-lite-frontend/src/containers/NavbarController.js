import { connect } from 'react-redux'
import INDINavbar from '../components/INDINavbar'
import Actions from '../actions'

const mapStateToProps = state => {
  return {
    section: state.navigation.section
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSelected: section => dispatch(Actions.Navigation.toSection(section))
  }
}


const NavbarController = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDINavbar)

export default NavbarController 


