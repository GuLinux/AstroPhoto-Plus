import React from 'react';
import { Container, Grid, Menu, Checkbox, Input, Loader, Form } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import ExposureInputContainer from './ExposureInputContainer';
import CurrentImageViewerContainer from './CurrentImageViewerContainer';
import AutoExposureContainer from './AutoExposureContainer';
import HistogramContainer from './HistogramContainer'

const Camera = ({
        cameras,
        currentCamera,
        options,
        setOption,
        setCurrentCamera,
        isShooting,
        imageLoading,
    }) => {
    if(cameras.length === 0)
        return <Redirect to='/' />;
    return (
        <Container fluid>
            <AutoExposureContainer />
            <Grid columns={16} stackable>
                <Grid.Column width={4}>

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
                        <Menu.Item><Checkbox label='Continuous' disabled={!currentCamera} slider size='tiny' checked={options.continuous} onChange={(e, data) => setOption({continuous: data.checked})} /></Menu.Item>
                        <Menu.Item header content='View Options' />
                        <Menu.Item><Checkbox label='Auto histogram stretch' slider size='mini' checked={options.stretch} onChange={(e, data) => setOption({stretch: data.checked})} /></Menu.Item>
                        {
                            options.stretch ? null : (
                                <Menu.Item>
                                    Manual showHistogram stretch
                                    <Menu.Menu>
                                        <Menu.Item>
                                            <Input
                                                type='number'
                                                min={0}
                                                max={100}
                                                step={0.1}
                                                value={options.clipLow}
                                                onChange={(e, data) => setOption({clipLow: data.value})}
                                                label='Clip shadows'
                                            />
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Input
                                                type='number'
                                                min={0}
                                                max={100}
                                                step={0.1}
                                                value={options.clipHigh}
                                                onChange={(e, data) => {
                                                    console.log(e)
                                                    console.log(data)
                                                    return setOption({clipHigh: data.value})
                                                }
                                                }
                                                label='Clip highlights'
                                            />
                                        </Menu.Item>
                                    </Menu.Menu>
                                </Menu.Item>
                            )
                        }
                        <Menu.Item>
                            <Form size='tiny'>
                                <Form.Select inline label='Display format' size='tiny' value={options.format} options={[
                                    { text: 'PNG', value: 'png'},
                                    { text: 'JPEG', value: 'jpeg' },
                                ]} onChange={(e, data) => setOption({stretch: data.value})}/>
                            </Form>
                        </Menu.Item>
                        <Menu.Item>
                            <Checkbox label='Fit image to screen' slider size='tiny' checked={options.fitToScreen} onChange={(e, data) => setOption({fitToScreen: data.checked})} />
                        </Menu.Item>

                        <Menu.Item header>
                            <Checkbox label='Histogram' slider size='tiny' checked={options.showHistogram} onChange={(e, data) => setOption({showHistogram: data.checked})} />
                        </Menu.Item>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Loader active={imageLoading} inverted />
                    <HistogramContainer />
                    <CurrentImageViewerContainer fitScreen={options.fitToScreen} />
                </Grid.Column>
            </Grid>
        </Container>
    );
}


export default Camera;
