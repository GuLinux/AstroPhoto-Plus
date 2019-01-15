import { connect } from 'react-redux';
import { ImageViewOptions } from './ImageViewOptions';
import { imageViewOptionsSelector } from './selectors';
import Actions from '../actions';

export const ImageViewOptionsContainer = connect(
    imageViewOptionsSelector,
    {
        setOption: Actions.Image.setOption,
    }

)(ImageViewOptions);