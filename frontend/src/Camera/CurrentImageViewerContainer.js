import { connect } from 'react-redux';
import { ImageViewer } from './ImageViewer';
import { currentImageSelector } from './selectors';
import Actions from '../actions';



const mapDispatchToProps = {
    onImageLoading: Actions.Camera.imageLoading,
    onImageLoaded: Actions.Camera.imageLoaded,
    setCrop: Actions.Camera.setCrop,
};

const CurrentImageViewerContainer = connect(
  currentImageSelector,
  mapDispatchToProps
)(ImageViewer)


export default CurrentImageViewerContainer;
