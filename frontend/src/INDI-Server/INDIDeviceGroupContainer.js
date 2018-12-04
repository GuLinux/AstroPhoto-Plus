import { connect } from 'react-redux'
import { INDIDeviceGroup } from './INDIDeviceGroup'
import { indiDeviceGroupSelector } from './selectors';


export const INDIDeviceGroupContainer = connect(
  indiDeviceGroupSelector,
)(INDIDeviceGroup)

