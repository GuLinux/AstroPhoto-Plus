import React from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { Image } from 'semantic-ui-react';

const ImageViewer = ({uri, fitScreen = false}) => uri ? (
    <div className='image-viewer'>
        { fitScreen ? <Image src={uri} /> : <img src={uri} /> }
    </div>
): null;


export default ImageViewer;
