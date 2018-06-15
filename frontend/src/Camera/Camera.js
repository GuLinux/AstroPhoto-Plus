import React from 'react';
import { Container, Grid, Menu, Checkbox, Select } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import ExposureInputContainer from './ExposureInputContainer';
import CurrentImageViewerContainer from './CurrentImageViewerContainer';


const Camera = ({ cameras, currentCamera, exposure, setCurrentCamera, setExposure, isShooting, format, stretch, setFormat, setStretch, fitToScreen, setFitToScreen}) => {
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
                        <Menu.Item><Checkbox label='Stretch image' slider size='tiny' checked={stretch} onChange={(e, data) => setStretch(data.checked)} /></Menu.Item>
                        <Menu.Item><Select label='Format' size='tiny' fluid value={format} options={[
                            { text: 'PNG', value: 'png'},
                            { text: 'JPEG', value: 'jpeg' },
                        ]} onChange={(e, data) => setFormat(data.value)}/></Menu.Item>

                        <Menu.Item><Checkbox label='Fit image to screen' slider size='tiny' checked={fitToScreen} onChange={(e, data) => setFitToScreen(data.checked)} /></Menu.Item>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={13}>
                    <CurrentImageViewerContainer fitScreen={fitToScreen} />
                </Grid.Column>
            </Grid>
        </Container>
    );
}


export default Camera;
