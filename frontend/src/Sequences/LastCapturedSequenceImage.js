import React from 'react';
import { Header, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ImageLoader } from '../Image/Image'


const LastCapturedSequenceImage = ({type, lastImageId, lastImage}) => lastImage ? (
    <Container>
        <Header content='Last captured image' />
        <Link to={`/image/main/${lastImageId}`}>
            <ImageLoader key={lastImageId} id={lastImageId} type={type} uri={lastImage} fitScreen={true} />
        </Link>
    </Container>
) : null;

export default LastCapturedSequenceImage;
