import React from 'react';
import { Celestial } from 'd3-celestial-react/index.dev';
import { Form, Container } from 'semantic-ui-react';
import { get, set } from 'lodash';

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
        };
    }

    setConfig = (key, value) => {
        const config = {...this.state.config};
        set(config, key, value);
        this.setState({...this.state, config: buildConfig(config)});
    }

    render = () => {
        const { config, zoom } = this.state;
        const { marker, form } = this.props;
        return (
            <React.Fragment>
                <Celestial config={config} zoom={zoom}>
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
                        <Form.Group inline>
                            <Form.Field inline>
                                <label>Stars magnitude</label>
                                <input type='range' min={0} max={14} step={0.5} value={config.stars.limit} onChange={e => this.setConfig('stars.limit', parseFloat(e.target.value))} />
                            </Form.Field>
                            <Form.Field inline>
                                <label>DSOs magnitude</label>
                                <input type='range' min={0} max={20} step={0.5} value={config.dsos.limit} onChange={e => this.setConfig('dsos.limit', parseFloat(e.target.value))} />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                )}
            </React.Fragment>
        );
    }
};