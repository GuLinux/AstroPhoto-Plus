import { connect } from 'react-redux'
import INDIServerPage from '../components/INDIServerPage'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => {
  return {
    serverState: state.indiserver
  }
}

const mapDispatchToProps = dispatch => {
    let setServerConnection = (connect) => dispatch(Actions.INDIServer.setServerConnection(connect));
    let addPendingProperty = (property, valueName, currentValue, newValue) => dispatch(Actions.INDIServer.addPendingProperty(property.device, property.group, property.name, valueName, currentValue, newValue));
    return { setServerConnection, addPendingProperty };
}

const INDIServerController = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerPage)

export default INDIServerController 

