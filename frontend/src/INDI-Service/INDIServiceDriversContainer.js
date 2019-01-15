import { connect } from 'react-redux'
import INDIServiceDriversPage from './INDIServiceDriversPage'
import Actions from '../actions'

import { getINDIServiceDrivers, getINDIServiceGroups } from './selectors'


const mapStateToProps = (state, ownProps) => ({
    drivers: getINDIServiceDrivers(state),
    groups: getINDIServiceGroups(state),
    serverFound: state.indiservice.server_found,
    serverRunning: state.indiservice.server_running,
})

const mapDispatchToProps = {
    toggleDriverSelection: Actions.INDIService.toggleDriver,
}

const INDIServiceDriversContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServiceDriversPage)

export default INDIServiceDriversContainer
