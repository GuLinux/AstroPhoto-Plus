import { connect } from 'react-redux'
import INDIDeviceGroup from './INDIDeviceGroup'
import { getVisibleProperties } from './selectors';


const mapStateToProps = (state, ownProps) => {
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

