import { connect } from 'react-redux'
import Actions from '../actions'
import INDIServicePage from '../components/INDIServicePage'

const mapStateToProps = (state, ownProps) => ({
    serverFound: state.indiservice.server_found,
    serverRunning: state.indiservice.server_running,
})

const mapDispatchToProps = dispatch => ({
})

const INDIServiceDevicesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServicePage)

export default INDIServicePageContainer
