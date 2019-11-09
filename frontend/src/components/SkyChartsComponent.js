import React from 'react';
import { get, range } from 'lodash';
import { fetch } from '../middleware/polyfills.js';
import { Dimmer, Container, Button, Loader, Form } from 'semantic-ui-react';
import { NumericInput } from '../components/NumericInput';



export class SkyChartComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { options: this.getStateOptionsFromProps() };
    }

    getStateOptionsFromProps = () => ({
        center: this.props.center,
        fov: this.props.fov,
        markers: this.props.markers,
        backgroundColor: this.props.backgroundColor,
        starsColor: this.props.starsColor,
        magnitudeLimit: get(this.props, 'magnitudeLimit', 6),
        maxLabelsMagnitude: get(this.props, 'maxLabelsMagnitude', 10),
        maxLabels: get(this.props, 'maxLabels', 20),
    });

    componentDidMount = async () => {
        await this.fetchMap();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps !== this.props) {
            this.setState({ options: this.getStateOptionsFromProps()});
        }
        if(prevState.options !== this.state.options) {
            this.fetchMap();
        }
    }

    buildOptions = () => {
        const options = {
                ra: this.state.options.center.ra,
                dec: this.state.options.center.dec,
                fov: this.state.options.fov,
                bg_color: this.state.options.backgroundColor,
                stars_color: this.state.options.starsColor,
                markers: this.state.options.markers,
                mag: this.state.options.magnitudeLimit,
                max_labels_mag: this.state.options.maxLabelsMagnitude,
                max_labels: this.state.options.maxLabels,
        };
        return options;
    }

    fetchMap = async () => {
        await this.setState({ loading: true });
        const url = '/api/skychart';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.buildOptions()),
        });
        if(response.ok && response.headers.has('content-type') && response.headers.get('content-type').includes('image/svg+xml')) {
            const svg = await response.text();
            this.setState({svg, loading: false});
        }

    }

    setOption = option => this.setState({ options: {...this.state.options, ...option} });

    setFoV  = fov => this.setOption({fov});
    zoomIn  = () => this.setFoV(this.state.options.fov * 0.5);
    zoomOut = () => this.setFoV(this.state.options.fov * 2.0);

    getMagnitudeLimitsOptions = () => {
        return range(5, 12.5, 1).map(n => ({
            key: n,
            text: n,
            value: n,
        }));
    }

    getLabelsLimitsOptions = () => {
        return [5, 10, 20, 50].map(n => ({
            key: n,
            text: n,
            value: n,
        }));
    }


    setMagnitudeLimit = (evt, d) => this.setOption({magnitudeLimit: d.value});
    setMaxLabels = (evt, d) => this.setOption({maxLabels: d.value});

    render = () => {
        if(this.state.svg) {
            return (
                <Container fluid>
                    <Dimmer.Dimmable dimmed={this.state.loading}>
                        <Dimmer active={this.state.loading} />
                        <Form size='mini'>
                            <Form.Group inline> 
                                <Form.Field disabled={this.state.loading}>
                                    <label>FoV</label>
                                    <NumericInput onChange={this.setFoV} value={this.state.options.fov} label='degrees' labelPosition='right' />
                                </Form.Field>
                                <Form.Field disabled={this.state.loading}>
                                    <Button.Group size='tiny'>
                                        <Button onClick={this.zoomIn}>+</Button>
                                        <Button onClick={this.zoomOut}>-</Button>
                                    </Button.Group>
                                </Form.Field>
                                <Form.Dropdown
                                    disabled={this.state.loading}
                                    label='Magnitude limit'
                                    inline
                                    options={this.getMagnitudeLimitsOptions()}
                                    defaultValue={this.state.options.magnitudeLimit}
                                    onChange={this.setMagnitudeLimit}
                                />
                                <Form.Dropdown
                                    disabled={this.state.loading}
                                    label='Max labels'
                                    inline
                                    options={this.getLabelsLimitsOptions()}
                                    defaultValue={this.state.options.maxLabels}
                                    onChange={this.setMaxLabels}
                                />

                            </Form.Group>
                        </Form>
                        <div className='skychart' dangerouslySetInnerHTML={this.getSVG()} />
                    </Dimmer.Dimmable>
                </Container>
            );

        }
        return <Loader active inverted>Loading</Loader>
    }

    getSVG = () => ({
        __html: this.state.svg,
    });
}




