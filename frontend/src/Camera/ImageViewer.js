import React from 'react';
import { Image, Icon, Button } from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';


class ImageComponent extends React.Component {
    componentDidUpdate = (prevProps) => this.props.uri !== prevProps.uri && this.props.onImageLoading && this.props.onImageLoading();
    componentDidMount = () => this.props.onImageLoading && this.props.onImageLoading();
    
    render = () => {
        const {uri, fitScreen, onImageLoaded} = this.props;
        let imgProps = onImageLoaded ? { onLoad: onImageLoaded, onError: onImageLoaded } : {};
        return <Image
            alt=''
            src={uri}
            {...imgProps}
            fluid={!fitScreen}
            ui={fitScreen}
        />;
    }
}

class ImageCrop extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.crop && props.crop.relative ? { crop: props.crop.relative } : {};
    }

    setCrop = (crop) => this.setState({...this.state, crop});

    onComplete = (crop, pixelCrop) => this.props.setCrop({ relative: crop, pixel: pixelCrop });

    render = () => {
        const { src, width, height } = this.props;
        const imageStyle = { width: width+10, height: height+10 };
        return (
            <React.Fragment>
                <Button icon='move' className='crop-move-button' compact toggle active={this.state.move} onClick={() => this.setState({...this.state, move: !this.state.move})} />
                <ReactCrop src={src} crop={this.state.crop} onChange={this.setCrop} onComplete={this.onComplete} style={imageStyle} imageStyle={imageStyle} disabled={this.state.move} />
            </React.Fragment>
        )
    }
}

const ImageViewer = ({uri, fitScreen = false, onImageLoading, onImageLoaded, crop, setCrop, imageInfo}) => {
    return uri ? (
        <div className='image-viewer'>
            { crop && (crop.initial || crop.relative) ?
                <ImageCrop src={uri} width={imageInfo.width} height={imageInfo.height} crop={crop} setCrop={setCrop} /> :
                <ImageComponent uri={uri} {...{onImageLoading, onImageLoaded, fitScreen}} />
            }
        </div>
    ): <Icon name='image outline' size='massive' disabled />;
}
export default ImageViewer;
