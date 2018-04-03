import { connect } from 'react-redux'
import INDIServerPage from '../components/INDIServerPage'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => ({
    devices: state.indiserver.devices.map(d => state.indiserver.deviceEntities[d]),
    indiDeviceTab: state.navigation.indiDevice in state.indiserver.deviceEntities ? state.navigation.indiDevice : null,
})

const mapDispatchToProps = dispatch => ({ navigateToDevice: device => dispatch(Actions.Navigation.toINDIDevice(device)) })

const INDIServerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerPage)

export default INDIServerContainer 

