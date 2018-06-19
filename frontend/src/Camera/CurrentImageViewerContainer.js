import { connect } from 'react-redux';
import ImageViewer from './ImageViewer';
import { imageUrlBuilder } from './ImageUrlBuilder';
import { getCurrentCamera } from './selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => {
    const currentCamera = getCurrentCamera(state);
    const currentImage = state.camera.currentImage;

    if(! currentCamera || ! currentImage) {
        return { }
    }
    return {
        uri: imageUrlBuilder(currentCamera.id, currentImage.id, state.camera.options),
        crop: state.camera.crop,
    }
}

const mapDispatchToProps = dispatch => ({
    onImageLoading: () => dispatch(Actions.Camera.imageLoading()),
    onImageLoaded: () => dispatch(Actions.Camera.imageLoaded()),
})

const CurrentImageViewerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageViewer)


export default CurrentImageViewerContainer;
