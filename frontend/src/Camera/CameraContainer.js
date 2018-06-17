import { connect } from 'react-redux';
import Camera from './Camera';
import { getConnectedCameraEntities } from '../Gear/selectors';
import { getCurrentCamera } from './selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    cameras: getConnectedCameraEntities(state),
    currentCamera: getCurrentCamera(state),
    options: state.camera.options,
    isShooting: state.camera.isShooting,
})

const mapDispatchToProps = dispatch => ({
    setCurrentCamera: (camera) => dispatch(Actions.Camera.setCamera(camera)),
    setOption: (option) => dispatch(Actions.Camera.setOption(option)),
})

const CameraContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera)


export default CameraContainer;
