import { connect } from 'react-redux'
import Images from './Images'
import { searchImages } from '../middleware/api';
import { Actions } from '../actions';

const mapStateToProps = (state, ownProps) => {
    if(! (ownProps.sequenceJob in state.sequenceJobs))
        return {};
    return {
        images: state.sequenceJobs[ownProps.sequenceJob].saved_images,
    };
}


const mapDispatchToProps = dispatch => ({
    fetchImages: (ids, onFetched) => searchImages(dispatch, 'main', { ids }, onFetched),
    onMount: (items) => dispatch(Actions.Navigation.setRightMenu(items)),
    onUnmount: () => dispatch(Actions.Navigation.resetRightMenu()),
})

const ImagesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Images)

export default ImagesContainer 

