import { connect } from 'react-redux'
import INDIServerDetailsPage from './INDIServerDetailsPage'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => ({ serverState: state.indiserver.state, })

const mapDispatchToProps = { 
    setServerConnection: Actions.INDIServer.setServerConnection,
};

const INDIServerDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerDetailsPage)

export default INDIServerDetailsContainer 

