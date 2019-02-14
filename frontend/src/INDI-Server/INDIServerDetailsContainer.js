import { connect } from 'react-redux'
import INDIServerDetailsPage from './INDIServerDetailsPage'
import Actions from '../actions'
import { indiServerDetailsSelector } from './selectors';


const mapDispatchToProps = { 
    setServerConnection: Actions.INDIServer.setServerConnection,
};

const INDIServerDetailsContainer = connect(
  indiServerDetailsSelector,
  mapDispatchToProps
)(INDIServerDetailsPage)

export default INDIServerDetailsContainer 

