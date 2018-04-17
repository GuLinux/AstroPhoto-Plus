import { connect } from 'react-redux'
import Actions from '../actions'
import { getDevicesProperties } from '../selectors/indi-properties'
import INDIPropertySequenceItem from '../components/INDIPropertySequenceItem'

const mapStateToProps = (state, ownProps) => {
    let propertiesMap = getDevicesProperties(state);
    return { propertiesMap, devices: state.indiserver.devices.map(d => state.indiserver.deviceEntities[d]) }
}


const mapDispatchToProps = dispatch => {
}

const INDIPropertySequenceItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(INDIPropertySequenceItem)

export default INDIPropertySequenceItemContainer 

