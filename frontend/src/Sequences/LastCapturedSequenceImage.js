import React from 'react';
import { Header, Container, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'


const LastCapturedSequenceImage = ({lastImageId, lastImage}) => lastImage ? (
    <Container>
        <Header content='Last captured image' />
        <Link to={`/image/main/${lastImageId}`}>
            <Image fluid src={lastImage} />
        </Link>
    </Container>
) : null;

export default LastCapturedSequenceImage;
