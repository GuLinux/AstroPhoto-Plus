import { connect } from 'react-redux';
import { Camera } from './Camera';
import { cameraContainerSelector } from './selectors';

const mapDispatchToProps = dispatch => ({
});

export const CameraContainer = connect(
  cameraContainerSelector,
  mapDispatchToProps
)(Camera)
