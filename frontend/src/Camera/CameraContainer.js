import { connect } from 'react-redux';
import Camera from './Camera';
import { getConnectedCameraEntities, getConnectedFilterWheelEntities } from '../Gear/selectors';
import { getCurrentCamera, getCurrentFilterWheel } from './selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    cameras: getConnectedCameraEntities(state),
    filterWheels: getConnectedFilterWheelEntities(state),
    currentCamera: getCurrentCamera(state),
    currentFilterWheel: getCurrentFilterWheel(state),
    options: state.camera.options,
    isShooting: state.camera.isShooting,
    imageLoading: state.camera.imageLoading,
})

const mapDispatchToProps = dispatch => ({
    setCurrentCamera: (camera) => dispatch(Actions.Camera.setCamera(camera)),
    setCurrentFilterWheel: (filterWheel) => dispatch(Actions.Camera.setFilterWheel(filterWheel)),
    setOption: (option) => dispatch(Actions.Camera.setOption(option)),
})

const CameraContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera)


export default CameraContainer;
