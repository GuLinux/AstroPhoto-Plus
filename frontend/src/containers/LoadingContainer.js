import { connect } from 'react-redux'
import LoadingPage from '../components/LoadingPage'


const mapStateToProps = state => {
  return {
    isLoading: state.network.fetching
  }
}

const LoadingContainer = connect(mapStateToProps)(LoadingPage)

export default LoadingContainer
