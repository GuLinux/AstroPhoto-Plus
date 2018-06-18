import React from 'react';
import { Image, Icon } from 'semantic-ui-react';

class ImageComponent extends React.Component {
    componentDidMount = () => this.props.onImageLoading && this.props.onImageLoading();
    componentDidUpdate= () => this.props.onImageLoading && this.props.onImageLoading();

    render = () => {
        const { uri, onImageLoaded, fitScreen } = this.props;
        let callbacks = onImageLoaded ? { onLoad: onImageLoaded, onError: onImageLoaded } : {};
        return <Image alt='' ui={fitScreen} src={uri} fluid={!fitScreen} {...callbacks} />;
    }
}

const ImageViewer = ({uri, fitScreen = false, onImageLoading, onImageLoaded}) => {
    return uri ? (
        <div className='image-viewer'>
            <ImageComponent uri={uri} onImageLoading={onImageLoading} onImageLoaded={onImageLoaded} fitScreen={fitScreen} />
        </div>
    ): <Icon name='image outline' size='massive' disabled />;
}
export default ImageViewer;
