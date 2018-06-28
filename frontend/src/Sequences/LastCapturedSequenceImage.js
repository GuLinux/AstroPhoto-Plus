import React from 'react';
import { Header, Container, Image } from 'semantic-ui-react'

const LastCapturedSequenceImage = ({lastImage}) => lastImage ? (
    <Container>
        <Header content='Last captured image' />
        <Image src={lastImage} />
    </Container>
) : null;

export default LastCapturedSequenceImage;
