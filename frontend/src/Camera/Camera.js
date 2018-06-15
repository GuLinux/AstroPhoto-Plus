import React from 'react';
import { Container, Grid, Menu } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import ExposureInputContainer from './ExposureInputContainer';
import CurrentImageViewerContainer from './CurrentImageViewerContainer';


const Camera = ({ cameras, currentCamera, exposure, setCurrentCamera, setExposure, isShooting}) => {
    if(cameras.length === 0)
        return <Redirect to='/' />;
    return (
        <Container fluid>
            <Grid columns={16}>
                <Grid.Column width={3}>
                    <Menu vertical borderless fluid size='tiny'>
                        <Menu.Item header content='Camera' />
                        { cameras.map(c => <Menu.Item
                            as='a'
                            active={currentCamera && currentCamera.id === c.id}
                            key={c.id} content={c.device.name}
                            onClick={() => setCurrentCamera(c.id)}
                        />) }
                        <Menu.Item header content='Exposure' disabled={!currentCamera || isShooting} />
                        <Menu.Item><ExposureInputContainer disabled={!currentCamera || isShooting} /></Menu.Item>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={13}>
                    <CurrentImageViewerContainer />
                </Grid.Column>
            </Grid>
        </Container>
    );
}


export default Camera;
