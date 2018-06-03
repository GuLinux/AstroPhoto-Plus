import { connect } from 'react-redux'
import PagesList from './PagesList'


const mapStateToProps = (state, ownProps) => ({ childKey: state.navigation[ownProps.navigation].key })

const PagesListContainer = connect(mapStateToProps)(PagesList)

export default PagesListContainer

