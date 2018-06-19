import React from 'react';
import { Image, Icon } from 'semantic-ui-react';

class ImageComponent extends React.Component {
    componentDidMount = () => {
        this.props.onImageLoading && this.props.onImageLoading();
    }
    componentDidUpdate= (prevProps) => {
        this.props.onImageLoading && prevProps.uri !== this.props.uri && this.props.onImageLoading();
    }


    render = () => {
        const { uri, onImageLoaded, fitScreen } = this.props;
        let callbacks = onImageLoaded ? { onLoad: onImageLoaded, onError: onImageLoaded } : {};
        return <Image
            alt=''
            src={uri}
            {...callbacks}
            fluid={!fitScreen}
            ui={fitScreen}
            onMouseMove={(e) => this.props.onOver && this.props.onOver(e)}
            onClick={e => this.props.onClick && this.props.onClick(e)}
        />;
    }
}

const ROIIndicator = ({enabled, topleft, x, y, position}) => {
    if(!enabled)
        return null;
    return (
        <div
            className='roi-indicator'
            style={{top: position.y, left: position.x, width: position.width, height: position.height}}
        >
            <div className={'roi-indicator ' + topleft ? 'roi-top' : 'roi-bottom' } />
            <div className={'roi-indicator ' + topleft ? 'roi-left' : 'roi-right' } />
        </div>
    );
}

class ImageROI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate = (prevProps) => {
        if(! prevProps.crop && !! this.props.crop) {
            this.setState({ cropStart: true });
        } else if(!this.props.crop && !! prevProps.crop) {
            this.setState({});
        }
    }

    onImageLoaded = (e) => {
        this.setState({...this.state, position: {x: e.target.x, y: e.target.y, width: e.target.width, height: e.target.height}})
        this.props.onImageLoaded();
    }

    render = () => {
        return (
            <div>
                <ROIIndicator position={this.state.position} topleft enabled={this.state.cropStart} x={this.state.startX} y={this.state.startY} top={this.state.imageY} left={this.state.imageX} />
                <ImageComponent {...{...this.props, onImageLoaded: this.onImageLoaded}} onOver={this.onOver} onClick={this.onClick} />
            </div>
        )
    }

    onOver = (e) => {
        if(! this.state.cropStart)
            return;
        let x = e.clientX - e.target.x;
        let y = e.clientY - e.target.y;
        this.setState({...this.state, startX: x, startY: y, imageX: e.target.x, imageY: e.target.y})
    }
}

const ImageViewer = ({uri, fitScreen = false, onImageLoading, onImageLoaded, crop}) => {
    return uri ? (
        <div className='image-viewer'>
            <ImageROI uri={uri} {...{onImageLoading, onImageLoaded, fitScreen, crop}} />
        </div>
    ): <Icon name='image outline' size='massive' disabled />;
}
export default ImageViewer;
