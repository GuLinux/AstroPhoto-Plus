import { connect } from 'react-redux'
import INDIDeviceGroup from './INDIDeviceGroup'
import { getVisibleProperties } from './selectors';


const mapStateToProps = (state, ownProps) => {
    let group = ownProps.group;
    let properties;
    if(group) {
        properties = getVisibleProperties(state, ownProps);
    }
    return {
        group,
        properties,
    }
}


const INDIDeviceGroupContainer = connect(
  mapStateToProps,
)(INDIDeviceGroup)

export default INDIDeviceGroupContainer
