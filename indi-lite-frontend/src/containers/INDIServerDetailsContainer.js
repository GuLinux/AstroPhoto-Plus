import { connect } from 'react-redux'
import INDIServerDetailsPage from '../components/INDIServerDetailsPage'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => ({ serverState: state.indiserver.state, })

const mapDispatchToProps = dispatch => ({ setServerConnection: (connect) => dispatch(Actions.INDIServer.setServerConnection(connect)) })

const INDIServerDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerDetailsPage)

export default INDIServerDetailsContainer 

