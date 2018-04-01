import { connect } from 'react-redux'
import INDIDeviceGroup from '../components/INDIDeviceGroup'
import Actions from '../actions'
import { getVisibleProperties } from '../selectors/indi-properties';


const mapStateToProps = (state, ownProps) => {
    let device = state.indiserver.deviceEntities[ownProps.device];
    let group = ownProps.group;
    return {
        group,
        properties: getVisibleProperties(state)
    }
}


const INDIDeviceGroupContainer = connect(
  mapStateToProps,
)(INDIDeviceGroup)

export default INDIDeviceGroupContainer 

