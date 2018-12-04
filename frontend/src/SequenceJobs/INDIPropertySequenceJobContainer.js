import { connect } from 'react-redux'
import { getDevicesProperties } from '../INDI-Server/selectors'
import INDIPropertySequenceJob from './INDIPropertySequenceJob'

const mapStateToProps = (state, ownProps) => {
    let propertiesMap = getDevicesProperties(state);
    return { propertiesMap, devices: state.indiserver.devices.map(d => state.indiserver.deviceEntities[d]) }
}


const INDIPropertySequenceJobContainer = connect(
  mapStateToProps,
)(INDIPropertySequenceJob)

export default INDIPropertySequenceJobContainer 

