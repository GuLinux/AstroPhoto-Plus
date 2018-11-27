import React from 'react';
import 'd3-celestial/celestial.css';
import * as d3 from 'd3-celestial/lib/d3.min';
import { createCelestial } from './celestial';

require('d3-celestial/lib/d3.geo.projection.js');

export const hour2CelestialDegree = (ra) => ra > 12 ? (ra - 24) * 15 : ra * 15;

export class Celestial extends React.Component {
    constructor(props) {
        super(props);
        this.celestial = createCelestial(d3);
        this.featuresCollections = [];
    }

    addFeaturesCollection = fc => this.featuresCollections.push(fc);

    componentDidMount = () => {
        this.containerMounted = new Date().getTime();
        this.featuresCollections.forEach(fc => fc(this.celestial));
        const { config, zoom } = this.props;
        this.celestial.display(config);
        if(zoom > 0) {
            this.zoom(zoom);
        }
    }

    zoom = factor => this.celestial.zoomBy(factor);

    updateConfig = () => {
        return; // TODO: currently config update seems to break the map
        const configUpdateSeconds = 5000;
        if(new Date().getTime() > this.containerMounted + configUpdateSeconds) {
            this.celestial.apply(this.props.config);
            this.configUpdateTimer = null;
        } else {
            if(! this.configUpdateTimer) {
                this.configUpdateTimer = setTimeout(this.updateConfig, configUpdateSeconds + 1);
            }
        }
    }

    componentDidUpdate = prevProps => {
        const { config, zoom } = this.props;
        if(prevProps.config !== config) {
            this.updateConfig();
        }
        if(prevProps.zoom !== zoom) {
            this.zoom(zoom);
        }
    }

    render = () => (
        <div>
            {React.Children.map(this.props.children, c => React.cloneElement(c, {addFeaturesCollection: this.addFeaturesCollection}))}
            <div id='celestial-map' />
        </div>
    )
}


class CelestialFeaturesCollection extends React.Component {
    constructor(props) {
        super(props);
        this.features = [];
    }

    addFeature = feature => this.features.push(feature);

    componentDidMount = () => {
        this.props.addFeaturesCollection(this.addToCelestial);
    }

    addToCelestial = celestial => celestial.add({
        type: 'json',
        callback: () => this.celCallback(celestial),
        redraw: () => this.celRedraw(celestial),
    });

    celCallback = celestial => {
        const json = {
            type: 'FeatureCollection',
            features: this.features,
        }

        celestial.container.selectAll(`.${this.props.objectsClass}`)
            .data(json.features)
            .enter().append("path")
            .attr("class", this.props.objectsClass); 
        celestial.redraw();
    }

    celRedraw = celestial => {
        // Select the added objects by class name as given previously
        celestial.container.selectAll(`.${this.props.objectsClass}`).each( d => {
        // If point is visible (this doesn't work automatically for points)
            if (celestial.clip(d.geometry.coordinates)) {
                // get point coordinates
                let pt = celestial.mapProjection(d.geometry.coordinates);
                // object radius in pixel, could be varable depending on e.g. magnitude
                let r = this.props.absoluteSize ? d.properties.size : Math.pow(parseInt(d.properties.size) * 0.25, 0.5);
                // draw on canvas
                // Set object styles
                celestial.setStyle(this.props.symbolStyle);
                // Start the drawing path
                celestial.context.beginPath();
                // Thats a circle in html5 canvas
                celestial.context.arc(pt[0], pt[1], r, 0, 2 * Math.PI);
                // Finish the drawing path
                celestial.context.closePath();
                // Draw a line along the path with the prevoiusly set stroke color and line width      
                celestial.context.stroke();
                // Fill the object path with the prevoiusly set fill color
                celestial.context.fill();     
                // Set text styles       
                celestial.setTextStyle(this.props.textStyle);
                // and draw text on canvas
                celestial.context.fillText(d.properties.name, pt[0]+r, pt[1]+r);
            }
        });
    }

    render = () => React.Children.map(this.props.children, c => React.cloneElement(c, {addFeature: this.addFeature}));
}

class CelestialComponentPoint extends React.Component {
    componentDidMount = () => {
        const { ra, dec, id, ...properties } = this.props;
        this.props.addFeature({
            type: 'Feature',
            id,
            properties,
            geometry: {
                type: 'Point',
                coordinates: [hour2CelestialDegree(ra), dec],
            }
        });
    }
    render = () => null;
} 

Celestial.FeaturesCollection = CelestialFeaturesCollection;
Celestial.Point = CelestialComponentPoint;
