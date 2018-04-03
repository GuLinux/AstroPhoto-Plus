import { connect } from 'react-redux'
import PagesList from '../components/PagesList'


const mapStateToProps = (state, ownProps) => {
  let key = state.navigation[ownProps.navigationKey];
  return {
    childKey: key
  }
}


const PagesListContainer = connect(mapStateToProps)(PagesList)

export default PagesListContainer

