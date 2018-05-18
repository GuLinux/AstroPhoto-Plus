import { connect } from 'react-redux'
import Actions from '../actions'
import INDIServicePage from '../components/INDIServicePage'
import { getINDIEnabledDrivers } from '../selectors/indiservice'

const mapStateToProps = (state, ownProps) => ({
    serverFound: state.indiservice.server_found,
    serverRunning: state.indiservice.server_running,
    drivers: getINDIEnabledDrivers(state),
    startStopPending: state.indiservice.startStopPending,
})

const mapDispatchToProps = dispatch => ({
    startService: (devices) => dispatch(Actions.INDIService.startService(devices)),
    stopService: () => dispatch(Actions.INDIService.stopService()),
})

const INDIServiceContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onServerStopStart: () => stateProps.serverRunning ? dispatchProps.stopService() : dispatchProps.startService(stateProps.drivers),
  })
)(INDIServicePage)

export default INDIServiceContainer
