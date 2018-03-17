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
    let addPendingProperties = (pendingProperties, autoApply) => dispatch(Actions.INDIServer.addPendingProperties(pendingProperties, autoApply));
    return { setServerConnection, addPendingProperties };
}

const INDIServerController = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerPage)

export default INDIServerController 

