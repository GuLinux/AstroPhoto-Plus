import React from 'react';
import { Image } from 'semantic-ui-react';

const ImageViewer = ({uri, fitScreen = false}) => uri ? (
    <div className='image-viewer'>
        { fitScreen ? <Image alt='' src={uri} /> : <img alt='' src={uri} /> }
    </div>
): null;


export default ImageViewer;
