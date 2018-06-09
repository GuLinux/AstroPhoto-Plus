import { connect } from 'react-redux'
import INDIServerPage from './INDIServerPage'
import { getDeviceNames } from './selectors';

const mapStateToProps = (state, ownProps) => ({
    devices: getDeviceNames(state),
    hasLocalServer: state.indiservice.server_found && state.indiserver.state.host === 'localhost',
})

const mapDispatchToProps = dispatch => ({ })

const INDIServerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServerPage)

export default INDIServerContainer
