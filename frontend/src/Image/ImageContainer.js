import { ImageSectionMenu, ImageLoader } from './Image';
import { connect } from 'react-redux';
import Actions from '../actions';
import { withRouter } from 'react-router';
import { imageSelector, imageSectionMenuSelector } from './selectors';


const mapDispatchToProps = {
    setOption: Actions.Image.setOption,
};


export const ImageContainer = withRouter(connect(
    imageSelector,
    mapDispatchToProps,
)(ImageLoader));

export const ImageSectionMenuContainer = connect(
    imageSectionMenuSelector,
    mapDispatchToProps
)(withRouter(ImageSectionMenu));


