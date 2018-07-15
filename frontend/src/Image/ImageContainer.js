import ImagePage from './Image';
import { connect } from 'react-redux';
import { imageUrlBuilder } from '../utils';
import Actions from '../actions';
import { withRouter } from 'react-router';


const mapStateToProps = (state, ownProps) => {
    if(!ownProps.id) {
        return {};
    }
    const type = ownProps.type || 'main';

    const { maxWidth, stretch, clipLow, clipHigh, format } = state.image;

    return {
        id: ownProps.id,
        type,
        url: imageUrlBuilder(ownProps.id, {
            type,
            maxWidth,
            stretch,
            clipLow,
            clipHigh,
            format,
        }),
        options: state.image,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const setOption = (option) => dispatch(Actions.Image.setOption(option));
    return { setOption };
};


const ImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ImagePage));


export default ImageContainer;
