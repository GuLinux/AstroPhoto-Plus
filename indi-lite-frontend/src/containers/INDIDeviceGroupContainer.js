import { connect } from 'react-redux'
import INDIDeviceGroup from '../components/INDIDeviceGroup'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => {
    let device = ownProps.device;
    let group = ownProps.group;
    return {
        device, 
        group,
        properties: device.properties.map(id => state.indiserver.properties[id]).filter(p => p.group === group.id),
    }
}


const INDIDeviceGroupContainer = connect(
  mapStateToProps,
)(INDIDeviceGroup)

export default INDIDeviceGroupContainer 

