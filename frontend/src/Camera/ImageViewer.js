import React from 'react';
import { Image } from 'semantic-ui-react';

const ImageViewer = ({uri, fitScreen = false, onImageLoading, onImageLoaded}) => {
    uri && onImageLoading && onImageLoading();
    let callbacks = onImageLoaded ? { onLoad: onImageLoaded, onError: onImageLoaded } : {};
    return uri ? (
        <div className='image-viewer'>
            { fitScreen ? <Image alt='' src={uri} {...callbacks} /> : <img alt='' src={uri} {...callbacks} /> }
        </div>
    ): null;
}
export default ImageViewer;
