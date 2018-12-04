import { ImagePage, ImageSectionMenu } from './Image';
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

const mapDispatchToProps = {
    setOption: Actions.Image.setOption,
};


export const ImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { pure: false }
)(ImagePage);

export const ImageSectionMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ImageSectionMenu));


