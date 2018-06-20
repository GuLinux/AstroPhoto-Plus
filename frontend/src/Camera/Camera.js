import React from 'react';
import { Container, Grid, Input, Loader, Form, Header, Segment, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import ExposureInputContainer from './ExposureInputContainer';
import CurrentImageViewerContainer from './CurrentImageViewerContainer';
import AutoExposureContainer from './AutoExposureContainer';
import HistogramContainer from './HistogramContainer';
import SelectFilterContainer from './SelectFilterContainer';

const FilterWheelSection = ({filterWheels, currentFilterWheel, setCurrentFilterWheel}) => (
    <React.Fragment>
        <Header size='tiny' content='FilterWheel' textAlign='center' />
        <Button.Group vertical size='mini' fluid basic>
        { filterWheels.map(c => <Button
            toggle
            active={currentFilterWheel && currentFilterWheel.id === c.id}
            key={c.id} content={c.device.name}
            onClick={() => setCurrentFilterWheel(c.id)}
        />) }
        </Button.Group>
        { currentFilterWheel &&
            <Form.Field inline>
                <label>Filter</label>
                <SelectFilterContainer basic size='tiny' labeled floating />
            </Form.Field>
        }
    </React.Fragment>
)


const Camera = ({
        cameras,
        currentCamera,
        filterWheels,
        options,
        setOption,
        setCurrentCamera,
        isShooting,
        imageLoading,
        currentFilterWheel,
        setCurrentFilterWheel,
        canCrop,
        crop,
        startCrop,
        resetCrop,
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
                            { filterWheels.length > 0 &&
                                <FilterWheelSection {...{filterWheels, currentFilterWheel, setCurrentFilterWheel}} />
                            }
                            <Header size='tiny' content='Exposure' textAlign='center' />
                            <Form.Field><ExposureInputContainer disabled={!currentCamera || isShooting} size='tiny' /></Form.Field>
                            <Form.Checkbox label='Continuous' disabled={!currentCamera} toggle size='mini' checked={options.continuous} onChange={(e, data) => setOption({continuous: data.checked})} />
                            <Header size='tiny' content='View Options' textAlign='center' />
                            <Form.Checkbox label='Auto histogram stretch' toggle size='mini' checked={options.stretch} onChange={(e, data) => setOption({stretch: data.checked})} />
                            {
                                !options.stretch && (<React.Fragment>
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
                                </React.Fragment>)
                            }

                            <Form.Select basic labeled floating inline label='Display format' size='tiny' value={options.format} options={[
                                { text: 'PNG', value: 'png'},
                                { text: 'JPEG', value: 'jpeg' },
                            ]} onChange={(e, data) => setOption({format: data.value})}/>
                            <Form.Checkbox label='Fit image to screen' toggle size='tiny' checked={options.fitToScreen} onChange={(e, data) => setOption({fitToScreen: data.checked})} />
                            <Header size='tiny' content='Histogram' textAlign='center' />
                            <Form.Checkbox label='Show histogram' toggle size='tiny' checked={options.showHistogram} onChange={(e, data) => setOption({showHistogram: data.checked})} />
                            {
                                options.showHistogram && (<React.Fragment>
                                    <Form.Checkbox
                                        key='log'
                                        label='logarithmic'
                                        toggle
                                        size='tiny'
                                        checked={options.histogramLogarithmic}
                                        onChange={(e, data) => setOption({histogramLogarithmic: data.checked})}
                                        />,
                                    <Form.Field key='bins'>
                                        <Input
                                            type='number'
                                            label='bins'
                                            size='tiny'
                                            min={0}
                                            max={255}
                                            value={options.histogramBins}
                                            onChange={(e, data) => setOption({histogramBins: data.value})}
                                        />
                                    </Form.Field>
                                </React.Fragment>)
                            }
                            <Header size='tiny' content='ROI' textAlign='center' />
                            <Button content='select ROI' size='tiny' fluid basic disabled={!canCrop || !!crop} onClick={startCrop}/>
                            <Button content='clear ROI' size='tiny' fluid basic disabled={!canCrop || !(!!crop && crop.pixel )} onClick={resetCrop}/>
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
