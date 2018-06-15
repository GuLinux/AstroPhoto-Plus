import { connect } from 'react-redux';
import Camera from './Camera';
import { getConnectedCameraEntities } from '../Gear/selectors';
import { getCurrentCamera } from './selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    cameras: getConnectedCameraEntities(state),
    currentCamera: getCurrentCamera(state),
    isShooting: state.camera.isShooting,
    format: state.camera.format,
    stretch: state.camera.stretch,
    fitToScreen: state.camera.fitToScreen,
    continuous: state.camera.continuous,
})

const mapDispatchToProps = dispatch => ({
    setCurrentCamera: (camera) => dispatch(Actions.Camera.setCamera(camera)),
    setFormat: (format) => dispatch(Actions.Camera.setFormat(format)),
    setStretch: (stretch) => dispatch(Actions.Camera.setStretch(stretch)),
    setFitToScreen: (fitToScreen) => dispatch(Actions.Camera.setFitToScreen(fitToScreen)),
    setContinuous: (continuous) => dispatch(Actions.Camera.setContinuous(continuous)),
})

const CameraContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera)


export default CameraContainer;
