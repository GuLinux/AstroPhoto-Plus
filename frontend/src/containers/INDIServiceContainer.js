import { connect } from 'react-redux'
import INDIServicePage from '../components/INDIServicePage'
import Actions from '../actions'

import { getINDIServiceDrivers, getINDIServiceGroups } from '../selectors/indiservice'


const mapStateToProps = (state, ownProps) => ({
    drivers: getINDIServiceDrivers(state),
    groups: getINDIServiceGroups(state),
    serverFound: state.indiservice.server_found,
    serverRunning: state.indiservice.server_running,
})

const mapDispatchToProps = dispatch => ({
    toggleDriverSelection: (driver, selected) => dispatch(Actions.INDIService.toggleDriver(driver, selected))
})

const INDIServiceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServicePage)

export default INDIServiceContainer
