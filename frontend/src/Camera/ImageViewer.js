import React from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { Image } from 'semantic-ui-react';

const ImageViewer = ({uri}) => uri ? (
    <Image src={uri} fluid />
): null;


export default ImageViewer;

