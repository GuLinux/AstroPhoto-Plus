import React from 'react';
import { Header, Container, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ImageLoader } from '../Image/Image'


class LastCapturedSequenceImage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => console.log('componentDidMount: ', this.props);
    componentDidUpdate = () => console.log('componentDidUpdate: ', this.props);

    render = () => {
        const {type, lastImageId, lastImage} = this.props;
        return lastImage ? (
            <Container>
                <Header content='Last captured image' />
                <Link to={`/image/main/${lastImageId}`}>
                    <ImageLoader key={lastImageId} id={lastImageId} type={type} uri={lastImage} fitScreen={true} />
                </Link>
            </Container>
        ) : null;
    }

}

export default LastCapturedSequenceImage;
