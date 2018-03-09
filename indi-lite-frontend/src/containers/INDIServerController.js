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
    return { setServerConnection };
}

const INDIServerController = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerPage)

export default INDIServerController 

