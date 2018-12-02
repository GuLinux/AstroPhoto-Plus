import React from 'react';
//import { Celestial } from 'd3-celestial-react/index.dev';
import { Celestial } from 'd3-celestial-react';
import { Form, Container, Label, Button } from 'semantic-ui-react';
import { get, set } from 'lodash';
import { NumericInput } from './NumericInput';

const dataFiles = [
    { file: 'stars.6.json', limit: 6, type: 'stars' },
    { file: 'stars.8.json', limit: 8, type: 'stars' },
    { file: 'stars.14.json', limit: 14, type: 'stars' },
    { file: 'dsos.bright.json', limit: 0, type: 'dsos' },
    { file: 'dsos.6.json', limit: 6, type: 'dsos' },
    { file: 'dsos.14.json', limit: 14, type: 'dsos' },
    { file: 'dsos.20.json', limit: 20, type: 'dsos' },
];

const getDataFile = (limit, type) => dataFiles.find(x => x.type === type && x.limit >= limit ).file;

const defaultConfig = {
    datapath: '/celestial',
    adaptable: true,
    transform: 'equatorial',
    form: false,
    controls: false,
    location: false,
    stars: {
        colors: false,
        limit: 6,
    },
    dsos: {
        limit: 6,
        namelimit: 6,
    }
};

const buildConfig = (config) => {
    const stars = get(config, 'stars', {limit: 6});
    const dsos = get(config, 'dsos', {limit: 10});
    return {
        ...config,
        stars: {
            ...stars,
            data: getDataFile(stars.limit, 'stars'),
        },
        dsos: {
            ...dsos,
            data: getDataFile(dsos.limit, 'dsos'),
        }
    }
}

export class CelestialPage extends React.Component {
    constructor(props) {
        super(props);
        const config = {
            ...defaultConfig,
            center: props.marker && [props.marker.ra, props.marker.dec] || [0,0],
        };

        props.starsLimit && set(config, 'stars.limit', props.starsLimit);
        props.dsosLimit && set(config, 'dsos.limit', props.dsosLimit);
        props.dsosNameLimit && set(config, 'dsos.namelimit', props.dsosNameLimit);

        this.state = {
            zoom: props.zoom,
            config: buildConfig(config),
            pending: {},
        };
        this.celestial = React.createRef();
    }

    setConfig = (key, value) => {
        const config = {...this.state.config};
        set(config, key, value);
        this.setState({...this.state, config: buildConfig(config)});
    }

    apply = () => {
        const config = {...this.state.config};

        Object.keys(this.state.pending).forEach(
            key => set(config, key, this.state.pending[key])
        );
        this.setState({...this.state, pending: {}, config: buildConfig(config)});
    }

    render = () => {
        const { config, zoom } = this.state;
        const { marker, form } = this.props;
        return (
            <React.Fragment>
                <Celestial config={config} zoom={zoom} ref={this.celestial}>
                    {marker && (
                        <Celestial.FeaturesCollection
                        objectsClass={marker.objectClass || 'marker'}
                        symbolStyle={{ stroke: marker.symbolStroke || '#ffffff', fill: marker.symbolFill || '#ffffff'}}
                        textStyle={{
                            fill: marker.textFill || '#ffffff',
                            font: marker.font || 'bold 15px Helvetica, Arial, sans-serif',
                            align: marker.textAlign || 'left', 
                            baseline: marker.textBaseline || 'bottom', 
                        }}
                        >
                            <Celestial.Point ra={marker.ra} dec={marker.dec} size={marker.size || 100} name={marker.name}/>
                        </Celestial.FeaturesCollection>
                    )}
                </Celestial>
                { form && (
                    <Form>
                        <div>
                            { get(this.state, ['pending', 'stars.limit'], 0) > 8 && 
                                <Label color='red' content='Warning: displaying stars with magnitude greater than 8 might slow down the application.' /> }
                            { get(this.state, ['pending', 'dsos.limit'], 0) > 12 && 
                                <Label color='red' content='Warning: displaying DSOs with magnitude greater than 12 might slow down the application.' /> }
                            { get(this.state, ['pending', 'dsos.namelimit'], 0) > 12 && 
                                <Label color='red' content='Warning: displaying DSOs names with magnitude greater than 12 might slow down the application.' /> }
                        </div>
                        <Form.Group>
                            <Form.Field inline>
                                <Button.Group size='mini'>
                                    <Button content='+' onClick={() => this.celestial.current.zoom(1.10)} />
                                    <Button content='-' onClick={() => this.celestial.current.zoom(0.90)} />
                                </Button.Group>
                            </Form.Field>
                            <Form.Field inline>
                                <label>Stars magnitude</label>
                                <NumericInput size='mini' min={0} max={14} step={0.5} value={this.getCfg('stars.limit')} onChange={v => this.setPending('stars.limit', v)} />
                            </Form.Field>
                            <Form.Field inline>
                                <label>DSOs magnitude</label>
                                <NumericInput size='mini' min={0} max={20} step={0.5} value={this.getCfg('dsos.limit')} onChange={v => this.setPending('dsos.limit', v)} />
                            </Form.Field>
                            <Form.Field inline> 
                                <label>DSOs labels magnitude</label>
                                <NumericInput size='mini' min={0} max={20} step={0.5} value={this.getCfg('dsos.namelimit')} onChange={v => this.setPending('dsos.namelimit', v)} />
                            </Form.Field>
                            <Form.Button size='mini' disabled={Object.keys(this.state.pending).length === 0} content='apply' onClick={() => this.apply()} />
                        </Form.Group>
                    </Form>
                )}
            </React.Fragment>
        );
    }

    getCfg = key => get(this.state.pending, key, get(this.state.config, key));
    setPending = (key, value) => this.setState({
        ...this.state,
        pending: {
            ...this.state.pending,
            [key]: value,
        },
    });

};