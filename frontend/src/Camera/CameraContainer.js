import { connect } from 'react-redux';
import { Camera, CameraSectionMenu } from './Camera';
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
    canCrop: !state.camera.isShooting && !state.camera.imageLoading && state.camera.currentImage,
    crop: state.camera.crop,
})

const mapDispatchToProps = dispatch => ({
    setCurrentCamera: (camera) => dispatch(Actions.Camera.setCamera(camera)),
    setCurrentFilterWheel: (filterWheel) => dispatch(Actions.Camera.setFilterWheel(filterWheel)),
    setOption: (option) => dispatch(Actions.Camera.setOption(option)),
    startCrop: () => dispatch(Actions.Camera.startCrop()),
    resetCrop: () => dispatch(Actions.Camera.resetCrop()),
})

export const CameraContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera)

export const CameraSectionMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraSectionMenu)


