import React from 'react';
import { Container, Grid, Input, Loader, Form, Header, Segment, Button } from 'semantic-ui-react';
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
                    <Segment>
                        <Form size='tiny'>
                            <Header size='tiny' content='Camera' textAlign='center' />
                            <Button.Group vertical size='mini' fluid basic>
                            { cameras.map(c => <Button
                                toggle
                                active={currentCamera && currentCamera.id === c.id}
                                key={c.id} content={c.device.name}
                                onClick={() => setCurrentCamera(c.id)}
                            />) }
                            </Button.Group>
                            <Header size='tiny' content='Exposure' textAlign='center' />
                            <Form.Field><ExposureInputContainer disabled={!currentCamera || isShooting} size='tiny' /></Form.Field>
                            <Form.Checkbox label='Continuous' disabled={!currentCamera} toggle size='mini' checked={options.continuous} onChange={(e, data) => setOption({continuous: data.checked})} />
                            <Header size='tiny' content='View Options' textAlign='center' />
                            <Form.Checkbox label='Auto histogram stretch' toggle size='mini' checked={options.stretch} onChange={(e, data) => setOption({stretch: data.checked})} />

                            {
                                options.stretch ? null : (
                                    [
                                        <Form.Field key='shadows'>
                                            <Input
                                                type='number'
                                                size='tiny'
                                                min={0}
                                                max={100}
                                                step={0.1}
                                                value={options.clipLow}
                                                onChange={(e, data) => setOption({clipLow: data.value})}
                                                label='Clip shadows'
                                            />
                                        </Form.Field>,
                                        <Form.Field key='highlights'>
                                            <Input
                                                type='number'
                                                size='tiny'
                                                min={0}
                                                max={100}
                                                step={0.1}
                                                value={options.clipHigh}
                                                onChange={(e, data) => setOption({clipHigh: data.value})}
                                                label='Clip highlights'
                                            />
                                        </Form.Field>
                                    ]
                                )
                            }

                            <Form.Select inline label='Display format' size='tiny' value={options.format} options={[
                                { text: 'PNG', value: 'png'},
                                { text: 'JPEG', value: 'jpeg' },
                            ]} onChange={(e, data) => setOption({stretch: data.value})}/>
                            <Form.Checkbox label='Fit image to screen' toggle size='tiny' checked={options.fitToScreen} onChange={(e, data) => setOption({fitToScreen: data.checked})} />
                            <Header size='tiny' content='Histogram' textAlign='center' />
                            <Form.Checkbox label='Show histogram' toggle size='tiny' checked={options.showHistogram} onChange={(e, data) => setOption({showHistogram: data.checked})} />
                            {
                                options.showHistogram ? ([
                                    <Form.Checkbox
                                        key='log'
                                        label='logarithmic'
                                        toggle
                                        size='tiny'
                                        checked={options.histogramLogarithmic}
                                        onChange={(e, data) => setOption({histogramLogarithmic: data.checked})}
                                        />,
                                    (<Form.Field key='bins'>
                                        <Input
                                            type='number'
                                            label='bins'
                                            size='tiny'
                                            min={0}
                                            max={255}
                                            value={options.histogramBins}
                                            onChange={(e, data) => setOption({histogramBins: data.value})}
                                        />
                                    </Form.Field>)
                                ]) : null
                            }
                        </Form>
                    </Segment>

                </Grid.Column>
                <Grid.Column width={12}>
                    <HistogramContainer />
                    <Loader active={imageLoading} inverted />
                    <CurrentImageViewerContainer fitScreen={options.fitToScreen} />
                </Grid.Column>
            </Grid>
        </Container>
    );
}


export default Camera;
