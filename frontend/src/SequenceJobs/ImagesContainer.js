import { connect } from 'react-redux'
import { Images, ImagesSectionMenu } from './Images'
import { searchImages } from '../middleware/api';
import { Actions } from '../actions';
import { withRouter } from 'react-router';

const mapStateToProps = (state, ownProps) => {
    if(! (ownProps.sequenceJob in state.sequenceJobs))
        return {};
    const sequenceJob = state.sequenceJobs[ownProps.sequenceJob];
    return {
        images: sequenceJob.saved_images,
        sequence: sequenceJob.sequence,
        previews: state.sequenceJobs.imagesPreview
    };
}

// TODO: try to rewrite this performance wise
const mapDispatchToProps = dispatch => ({
    fetchImages: (ids, onFetched) => searchImages(dispatch, 'main', { ids }, onFetched),
    setImagesPreview: (imagesPreview) => dispatch(Actions.SequenceJobs.setImagesPreview(imagesPreview)),
})

export const ImagesContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Images));

export const SequenceJobImagesContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImagesSectionMenu))


