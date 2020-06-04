import { connect } from 'react-redux';
import { ImageViewer } from './ImageViewer';
import { currentImageSelector } from './selectors';
import { imageLoading, imageLoaded, setCrop } from './actions';



const mapDispatchToProps = {
    onImageLoading: imageLoading,
    onImageLoaded: imageLoaded,
    setCrop,
};

const CurrentImageViewerContainer = connect(
  currentImageSelector,
  mapDispatchToProps
)(ImageViewer)


export default CurrentImageViewerContainer;
