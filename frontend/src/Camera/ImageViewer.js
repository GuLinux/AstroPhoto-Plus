import React from 'react';
import { Icon, Button, Popup } from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';
import { ImageLoader } from '../Image/Image';


class ImageCrop extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.crop && props.crop.relative ? { crop: props.crop.relative } : {};
    }

    setCrop = (crop) => this.setState({...this.state, crop});

    onComplete = (crop, pixelCrop) => this.props.setCrop({ relative: crop, pixel: pixelCrop });

    toggleMove = () => this.setState({...this.state, move: !this.state.move})

    render = () => {
        const { src, width, height } = this.props;
        const imageStyle = { width: width+10, height: height+10 };
        return (
            <React.Fragment>
                <Popup content='Toggle region selection in order to allow moving around with touch devices' position='top right' trigger={
                    <Button icon='move' className='crop-move-button' circular size='large' compact toggle active={this.state.move} onClick={() => this.toggleMove() } />
                } />
                <ReactCrop src={src} crop={this.state.crop} onChange={this.setCrop} onComplete={this.onComplete} style={imageStyle} imageStyle={imageStyle} disabled={this.state.move} />
            </React.Fragment>
        )
    }
}

const ImageViewer = ({uri, id, type, fitScreen = false, onImageLoading, onImageLoaded, crop, setCrop, imageInfo}) => {
    return uri ? (
        <div className='image-viewer'>
            { crop && (crop.initial || crop.relative) ?
                <ImageCrop src={uri} width={imageInfo.width} height={imageInfo.height} crop={crop} setCrop={setCrop} /> :
                <ImageLoader id={id} type={type} uri={uri} {...{onImageLoading, onImageLoaded, fitScreen}} />
            }
        </div>
    ): <Icon name='image outline' size='massive' disabled />;
}
export default ImageViewer;
