import { connect } from 'react-redux'
import { getDevicesProperties } from '../INDI-Server/selectors'
import INDIPropertySequenceItem from './INDIPropertySequenceItem'

const mapStateToProps = (state, ownProps) => {
    let propertiesMap = getDevicesProperties(state);
    return { propertiesMap, devices: state.indiserver.devices.map(d => state.indiserver.deviceEntities[d]) }
}


const mapDispatchToProps = dispatch => ({})

const INDIPropertySequenceItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(INDIPropertySequenceItem)

export default INDIPropertySequenceItemContainer 

