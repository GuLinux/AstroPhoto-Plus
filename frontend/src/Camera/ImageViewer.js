import React from 'react';
import { Image, Icon } from 'semantic-ui-react';

class ImageComponent extends React.Component {
    componentDidUpdate = (prevProps) => this.props.uri !== prevProps.uri && this.props.onImageLoading && this.props.onImageLoading();
    componentDidMount = () => this.props.onImageLoading && this.props.onImageLoading();
    
    render = () => {
        const {uri, fitScreen, onImageLoading, onImageLoaded} = this.props;
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


class ImageROIContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roi: this.initialROI() };
    }

    initialROI = () => ({ x: 0, y: 0, endX: 0, endY: 0, width: 0, height: 0 });

    onImageLoaded = (e) => {
        this.setState({
            ...this.state,
            imagePosition: {
                x: e.target.x,
                y: e.target.y,
                width: e.target.width,
                height: e.target.height,
            }, roi: {
                ...this.state.roi,
                width: e.target.width,
                height: e.target.height,
                endX: e.target.width,
                endY: e.target.height,
            }
        });
        this.props.onImageLoaded && this.props.onImageLoaded();
    }

    getEventRelCoords = (e) => {
        const divCoords = e.target.getBoundingClientRect();
        return {
            x: e.clientX - divCoords.x,
            y: e.clientY - divCoords.y,
        }
    }

    updateStartPosition = (relCoords) => this.setState({...this.state, roi: { x: relCoords.x, y: relCoords.y }}); 
    updateEndPosition = (endPosition) => 
            this.setState({...this.state, roi: {...this.state.roi, ...endPosition}});
    endCropPosition = (relCoords) => ({
        endX: relCoords.x,
        endY: relCoords.y,
        width: this.state.imagePosition.width - relCoords.x,
        height: this.state.imagePosition.height - relCoords.y
    }); 


    onMove = (e) => {
        if(!this.props.crop)
            return;
        const relCoords = this.getEventRelCoords(e);
        if(this.props.crop.initial) {
            this.updateStartPosition(relCoords);
        } else if(this.props.crop.x && this.props.crop.y && ! this.props.crop.width) {
            this.updateEndPosition(this.endCropPosition(relCoords));
        }
    }

    onClick = (e) => {
        if(!this.props.crop)
            return;
        const relCoords = this.getEventRelCoords(e);
        if(this.props.crop.initial) {
            this.updateStartPosition(relCoords);
            this.props.setStartCrop(relCoords.x, relCoords.y);
        } else if(this.props.crop.x && this.props.crop.y && ! this.props.crop.width) {
            const endPosition = this.endCropPosition(relCoords);
            this.updateEndPosition(endPosition);
            this.props.setEndCrop(endPosition.width, endPosition.height);
        } 
    }

    containerCoordinates = () => ({
        width: this.state.imagePosition.width,
        height: this.state.imagePosition.height,
    })

    render = () => {
        const { onImageLoading, fitScreen, uri, crop } = this.props;
        return (
            <React.Fragment>
            { crop && (
                <React.Fragment>
                    <div className='roi-container roi-container-outer' style={this.containerCoordinates()} onMouseMove={e => this.onMove(e)} onClick={e => this.onClick(e)} />
                    <div className='roi-container' style={this.containerCoordinates()}>
                        <div className='roi-top roi-indicator' style={{ width: this.state.imagePosition.width, height: this.state.roi.y }} />
                        <div className='roi-left roi-indicator' style={{ width: this.state.roi.x, height: this.state.imagePosition.height }} />
                        <div className='roi-right roi-indicator' style={{ height: this.state.imagePosition.height, width: this.state.roi.width }} />
                        <div className='roi-bottom roi-indicator' style={{ width: this.state.imagePosition.width, height: this.state.roi.height }} />
                    </div>
                </React.Fragment>
            )}
                <ImageComponent uri={uri} onImageLoaded={(e) => this.onImageLoaded(e)} {...{onImageLoading, fitScreen}} />
            </React.Fragment>
        )
    }
}

const ImageViewer = ({uri, fitScreen = false, onImageLoading, onImageLoaded, crop, setStartCrop, setEndCrop}) => {
    return uri ? (
        <div className='image-viewer'>
            <ImageROIContainer uri={uri} {...{onImageLoading, onImageLoaded, fitScreen, crop, setStartCrop, setEndCrop}} />
        </div>
    ): <Icon name='image outline' size='massive' disabled />;
}
export default ImageViewer;
