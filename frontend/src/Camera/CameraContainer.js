import { connect } from 'react-redux';
import { Camera } from './Camera';
import { cameraContainerSelector } from './selectors';

export const CameraContainer = connect(
  cameraContainerSelector,
  null,
)(Camera)
