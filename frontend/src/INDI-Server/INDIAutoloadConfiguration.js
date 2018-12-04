import { connect } from 'react-redux'
import Actions from '../actions'

// TODO: remove, and replace with getState in action
const mapStateToProps = (state, ownProps) => ({
    device: state.indiserver.deviceEntities[ownProps.device]
})

const mapDispatchToProps = {
    onConnected: Actions.INDIServer.autoloadConfig,
};

const INDIAutoloadConfigurationDummy = ({device, onConnected}) => {
    if(device && Date.now() - device.lastConnected < 5000 && ! device.configAutoloaded) {
        setTimeout(() => onConnected(device), 5000);
    }
    return null;
}

const INDIAutoloadConfiguration = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIAutoloadConfigurationDummy)

export default INDIAutoloadConfiguration
