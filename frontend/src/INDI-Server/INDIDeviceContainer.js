import { connect } from 'react-redux'
import { INDIDevicePage } from './INDIDevicePage'
import { indiDeviceContainerSelector } from './selectors-redo';

export const INDIDeviceContainer = connect(
  indiDeviceContainerSelector,
  null,
)(INDIDevicePage)

