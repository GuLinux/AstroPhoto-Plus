import React from 'react';
import 'd3-celestial/celestial.css';
import * as d3 from 'd3-celestial/lib/d3.min';
import { createCelestial } from './celestial';

require('d3-celestial/lib/d3.geo.projection.js');


export class CelestialComponent extends React.Component {
    constructor(props) {
        super(props);
        this.celestial = createCelestial(d3);
    }
    componentDidMount = () => {
        this.celestial.display(this.props.config);
    }

    render = () => (
        <div>
            {React.Children.map(this.props.children, c => React.cloneElement(c, {celestial: this.celestial}))}
            <p>Celestial component</p>
            <div id='celestial-map' />
        </div>
    )
}

class CelestialComponentPoint extends React.Component {
    componentDidMount = () => {
        const { ra, dec, id, ...properties } = this.props;
        this.props.celestial.add({
            type: "FeatureCollection",
            features: [
                {
                    type: 'Feature',
                    id,
                    properties,
                    geometry: {
                        type: 'Point',
                        coordinates: [ra, dec],
                    },
                },
            ],
        });
    }

    render = () => null;
} 

CelestialComponent.Point = CelestialComponentPoint;