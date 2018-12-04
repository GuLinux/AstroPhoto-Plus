import { connect } from 'react-redux'
import INDIDeviceGroup from './INDIDeviceGroup'
import { indiDeviceGroupSelector } from './selectors';


const INDIDeviceGroupContainer = connect(
  indiDeviceGroupSelector,
)(INDIDeviceGroup)

export default INDIDeviceGroupContainer
