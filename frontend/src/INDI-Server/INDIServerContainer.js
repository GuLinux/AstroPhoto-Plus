import { connect } from 'react-redux'
import INDIServerPage from './INDIServerPage'
import Actions from '../actions'
import { getDeviceNames } from './selectors';

const mapStateToProps = (state, ownProps) => ({
    devices: getDeviceNames(state),
    indiDeviceTab: state.navigation.indi.device in state.indiserver.deviceEntities ? state.navigation.indi.device : null,
    hasLocalServer: state.indiservice.server_found && state.indiserver.state.host === 'localhost',
})

const mapDispatchToProps = dispatch => ({ navigateToDevice: device => dispatch(Actions.Navigation.toINDIDevice(device)) })

const INDIServerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerPage)

export default INDIServerContainer
