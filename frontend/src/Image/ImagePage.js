import React from 'react';
import { ImageContainer } from './ImageContainer';
import { Container } from 'semantic-ui-react';
import HistogramContainer from './HistogramContainer';

export const ImagePage = ({id, type}) => id ?(
    <Container fluid>
        <HistogramContainer imageId={id} type={type} />
        <ImageContainer id={id} type={type} />
    </Container>
) : null;
