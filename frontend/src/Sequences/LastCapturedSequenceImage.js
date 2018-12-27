import React from 'react';
import { Header, Container, Radio, Message} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ImageLoader } from '../Image/Image'


class LastCapturedSequenceImageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.changeImageShown(true);
    }

    changeImageShown = (initialSet) => {
        const newState = { shownImage: this.props };
        if(initialSet) {
            // eslint-disable-next-line
            this.state = newState;
        } else {
            this.setState({...this.state, ...newState});
        }
        this.loading = !!this.props.lastImage;
        this.lastShown = null;
    }

    onImagePropsChanged = () => {
        if(!this.state.shownImage.lastImage) {
            this.changeImageShown();
            return;
        }

        if(this.loading) {
            this.setImageTimerOnLoad = true;
            return;
        }

        const elapsed = new Date() - this.lastShown;
        if(elapsed < 5000) {
            this.setImageTimer(5000 - elapsed);
            return;
        }

        this.changeImageShown();
    }


    setImageTimer = (millis = 5000) => {
        if(this.changeImageTimer) {
            return;
        }
        this.changeImageTimer = setTimeout(() => {
            this.changeImageShown();
            this.changeImageTimer = null;
        }, millis);
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.lastImageId !== this.props.lastImageId) {
            this.onImagePropsChanged();
        }
    }

    onImageLoaded = () => {
        if(this.setImageTimerOnLoad) {
            this.setImageTimer();
        }
        this.loading = false;
        this.setImageTimerOnLoad = false;
        this.lastShown = new Date();
    }

    render = () => {
        const {type, lastImageId, lastImage} = this.state.shownImage;
        return lastImage ? (
            <Link to={`/image/main/${lastImageId}`}>
                <ImageLoader key={lastImageId} id={lastImageId} type={type} uri={lastImage} fitScreen={true} onImageLoaded={this.onImageLoaded} />
            </Link>
        ) : (
            <Message content='No image was saved yet.' />
        );
    }

    componentWillUnmount = () => {
        if(this.changeImageTimer) {
            clearTimeout(this.changeImageTimer);
        }
    }

}


export class LastCapturedSequenceImage extends React.PureComponent {
    render = () => {
        const {showLastImage, toggleShowLastImage, ...props} = this.props;
        return (
            <Container>
                <Header>
                    <Radio toggle label='Last captured image' checked={showLastImage} onChange={() => toggleShowLastImage(!showLastImage)} />
                </Header>
                { showLastImage && <LastCapturedSequenceImageComponent {...props} /> }
            </Container>
        );
    }
}

