import React from 'react';
import { Icon, Button, Popup } from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';
import { ImageContainer } from '../Image/ImageContainer';
import HistogramContainer from '../Image/HistogramContainer';
import { StickyPortal } from '../components/StickyPortal';

const ToggleRegionSelection = ({active, toggleActive}) => (
    <Popup content='Toggle region selection in order to allow moving around with touch devices' position='top right' trigger={
        <Button icon='move' className='crop-move-button' circular size='large' compact toggle active={active} onClick={toggleActive} />
    } />
);

class ImageCrop extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.crop && props.crop.relative ? { crop: props.crop.relative } : {};
    }

    setCrop = (crop, percentCrop) => {
        this.setState({...this.state, crop});
    }

    onComplete = (crop, percentCrop) => {
        this.props.setCrop({ relative: percentCrop, pixel: crop});
    }

    toggleMove = () => this.setState({...this.state, move: !this.state.move})

    render = () => {
        const { src, width, height } = this.props;
        const imageStyle = { width: width+10, height: height+10 };
        return (
            <React.Fragment>
                <StickyPortal>
                    <ToggleRegionSelection active={this.state.move} toggleActive={this.toggleMove} />
                </StickyPortal>
                <ReactCrop src={src} crop={this.state.crop} onChange={this.setCrop} onComplete={this.onComplete} style={imageStyle} imageStyle={imageStyle} disabled={this.state.move} />
            </React.Fragment>
        )
    }
}

export const ImageViewer = ({uri, id, type, onImageLoading, onImageLoaded, crop, setCrop, imageInfo}) => {
    return id ? (
        <div className='image-viewer'>
            <HistogramContainer imageId={id} type={type} />
            { crop && (crop.initial || crop.relative) ?
                <ImageCrop src={uri} width={imageInfo.width} height={imageInfo.height} crop={crop} setCrop={setCrop} /> :
                <ImageContainer key={id} id={id} type={type} {...{onImageLoading, onImageLoaded}} />
            }
        </div>
    ): <Icon name='image outline' size='massive' disabled />;
}
