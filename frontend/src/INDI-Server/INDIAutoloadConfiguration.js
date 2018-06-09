import { connect } from 'react-redux'
import Actions from '../actions'

const mapStateToProps = (state, ownProps) => ({
    device: state.indiserver.deviceEntities[ownProps.device]
})

const mapDispatchToProps = dispatch => ({
    onConnected: (device) => dispatch(Actions.INDIServer.autoloadConfig(device))
})

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
