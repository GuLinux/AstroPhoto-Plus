import { connect } from 'react-redux';
import ImageViewer from './ImageViewer';
import { imageUrlBuilder } from './ImageUrlBuilder';
import { getCurrentCamera } from './selectors';

const mapStateToProps = (state, ownProps) => {
    const currentCamera = getCurrentCamera(state);
    const currentImage = state.camera.currentImage;

    if(! currentCamera || ! currentImage) {
        return {}
    }
    return {
        uri: imageUrlBuilder(currentCamera.id, currentImage.id), 
    }
}

const mapDispatchToProps = dispatch => ({
})

const CurrentImageViewerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageViewer)


export default CurrentImageViewerContainer;
