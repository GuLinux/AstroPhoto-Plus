import { connect } from 'react-redux'
import Actions from '../actions'
import INDIServicePage from './INDIServicePage'
import { getINDIEnabledDrivers } from './selectors'

const mapStateToProps = (state, ownProps) => ({
    serverFound: state.indiservice.server_found,
    serverConnected: state.indiserver.state.connected,
    serverRunning: state.indiservice.server_running,
    drivers: getINDIEnabledDrivers(state),
    startStopPending: state.indiservice.startStopPending,
    lastError: state.indiservice.lastError,
})

const mapDispatchToProps = {
    startService: Actions.INDIService.startService,
    stopService: Actions.INDIService.stopService,
    dismissError: Actions.INDIService.dismissError,
};

const INDIServiceContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(INDIServicePage)

export default INDIServiceContainer
