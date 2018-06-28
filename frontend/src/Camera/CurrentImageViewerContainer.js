import { connect } from 'react-redux';
import ImageViewer from './ImageViewer';
import { imageUrlBuilder } from '../utils';
import { getCurrentCamera } from './selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => {
    const currentCamera = getCurrentCamera(state);
    const currentImage = state.camera.currentImage;

    if(! currentCamera || ! currentImage) {
        return { }
    }
    return {
        uri: imageUrlBuilder(currentImage.id, {...state.camera.options, type: 'camera' }),
        imageInfo: currentImage.image_info,
        crop: state.camera.crop,
    }
}

const mapDispatchToProps = dispatch => ({
    onImageLoading: () => dispatch(Actions.Camera.imageLoading()),
    onImageLoaded: () => dispatch(Actions.Camera.imageLoaded()),
    setCrop: (crop) => dispatch(Actions.Camera.setCrop(crop)),
})

const CurrentImageViewerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageViewer)


export default CurrentImageViewerContainer;
