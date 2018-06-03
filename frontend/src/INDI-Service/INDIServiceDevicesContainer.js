import { connect } from 'react-redux'
import INDIServiceDevicesPage from './INDIServiceDevicesPage'
import Actions from '../actions'

import { getINDIServiceDrivers, getINDIServiceGroups } from './selectors'


const mapStateToProps = (state, ownProps) => ({
    drivers: getINDIServiceDrivers(state),
    groups: getINDIServiceGroups(state),
    serverFound: state.indiservice.server_found,
    serverRunning: state.indiservice.server_running,
})

const mapDispatchToProps = dispatch => ({
    toggleDriverSelection: (driver, selected) => dispatch(Actions.INDIService.toggleDriver(driver, selected))
})

const INDIServiceDevicesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServiceDevicesPage)

export default INDIServiceDevicesContainer
