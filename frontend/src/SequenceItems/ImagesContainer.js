import { connect } from 'react-redux'
import Images from './Images'
import { getImages } from '../middleware/api';
import { Actions } from '../actions';

const mapStateToProps = (state, ownProps) => {
    if(! (ownProps.sequenceItem in state.sequenceItems))
        return {};
    return {
        images: state.sequenceItems[ownProps.sequenceItem].saved_images,
    };
}


const mapDispatchToProps = dispatch => ({
    fetchImages: (onFetched) => getImages(dispatch, 'main', onFetched),
    onMount: (items) => dispatch(Actions.Navigation.setRightMenu(items)),
    onUnmount: () => dispatch(Actions.Navigation.resetRightMenu()),
})

const ImagesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Images)

export default ImagesContainer 

