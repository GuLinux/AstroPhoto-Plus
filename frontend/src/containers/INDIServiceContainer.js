import { connect } from 'react-redux'
import Actions from '../actions'
import INDIServicePage from '../components/INDIServicePage'
import { getINDIEnabledDrivers } from '../selectors/indiservice'

const mapStateToProps = (state, ownProps) => ({
    serverFound: state.indiservice.server_found,
    serverConnected: state.indiserver.state.connected,
    serverRunning: state.indiservice.server_running,
    drivers: getINDIEnabledDrivers(state),
    startStopPending: state.indiservice.startStopPending,
    lastError: state.indiservice.lastError,
})

const mapDispatchToProps = dispatch => ({
    startService: (devices) => dispatch(Actions.INDIService.startService(devices)),
    stopService: (disconnect) => dispatch(Actions.INDIService.stopService(disconnect)),
    dismissError: () => dispatch(Actions.INDIService.dismissError()),
})

const INDIServiceContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onServerStopStart: () => stateProps.serverRunning ? dispatchProps.stopService(stateProps.serverConnected) : dispatchProps.startService(stateProps.drivers),
  })
)(INDIServicePage)

export default INDIServiceContainer
