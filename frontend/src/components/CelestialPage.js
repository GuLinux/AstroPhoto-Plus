import React from 'react';
import { Celestial } from 'd3-celestial-react/index.dev';

const defaultConfig = {
    datapath: '/celestial',
    adaptable: true,
    form: false,
    location: false,
    stars: {
        colors: false,
        limit: 6,
//            data: 'stars.14.json',
    },
    dsos: {
        limit: 10,
        namelimit: 6,
        data: 'dsos.14.json',
    }
};



export class CelestialPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: props.zoom,
            config: {
                ...defaultConfig,
                center: props.marker && [props.marker.ra, props.marker.dec],
            },
        };
    }

    render = () => {
        const { config, zoom } = this.state;
        const { marker } = this.props;
        return (
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
        );
    }
};