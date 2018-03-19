import { connect } from 'react-redux'
import INDIServerPage from '../components/INDIServerPage'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => {
  return {
    serverState: state.indiserver,
    indiDeviceTab: state.navigation.indiDevice,
    indiGroupTab: state.navigation.indiGroup,
  }
}

const mapDispatchToProps = dispatch => {
    let setServerConnection = (connect) => dispatch(Actions.INDIServer.setServerConnection(connect));
    let addPendingProperties = (pendingProperties, autoApply) => dispatch(Actions.INDIServer.addPendingProperties(pendingProperties, autoApply));
    let commitPendingProperties = (pendingProperties) => dispatch(Actions.INDIServer.commitPendingProperties(pendingProperties));
    let navigateToDevice = (device) => dispatch(Actions.Navigation.toINDIDevice(device));
    let navigateToDeviceGroup = (device, group) => dispatch(Actions.Navigation.toINDIGroup(device, group));
    return { setServerConnection, addPendingProperties, commitPendingProperties, navigateToDevice, navigateToDeviceGroup };
}

const INDIServerController = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerPage)

export default INDIServerController 

