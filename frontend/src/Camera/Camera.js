import React from 'react';
import { Container, Form } from 'semantic-ui-react';
import CurrentImageViewerContainer from './CurrentImageViewerContainer';
import { AutoExposureContainer } from './AutoExposureContainer';
import { NotFoundPage } from '../components/NotFoundPage';
import { CameraShootingSectionMenuEntriesContaner, CameraImageOptionsSectionMenuEntriesContainer } from './CameraSectionMenuEntriesContainer';


export const CameraSectionMenu = () => (
    <Form size='tiny'>
        <CameraShootingSectionMenuEntriesContaner section='cameraPage'/>
        <CameraImageOptionsSectionMenuEntriesContainer section='cameraPage' />
    </Form>
)


export const Camera = ({options, cameras}) => {
    if(cameras.length === 0)
        return <NotFoundPage
            backToUrl='/indi/server'
            title='No camera found'
            message='Camera not found. Please double check that your INDI server is connected, with at least one connected camera.'
            backButtonText='INDI server page'
        />
    return (
        <Container fluid>
            <AutoExposureContainer />
            <CurrentImageViewerContainer fitScreen={options.fitToScreen} />
        </Container>
    );
}


