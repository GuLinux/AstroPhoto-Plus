import React from 'react';
import { get } from 'lodash';
import { fetch } from '../middleware/polyfills.js';



export class SkyChartComponent extends React.Component {
    state = {};

    componentDidMount = async () => {
        console.log(this.props)
        await this.fetchMap(this.props.initialFoV);
    }

    fetchMap = async (fov) => {
        const markers = get(this.props, 'markers', []);
        const url = '/api/skychart';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ra: this.props.center.ra,
                dec: this.props.center.dec,
                fov: fov,
                markers,
            }),
        });
        console.log(response, response.headers)
        if(response.ok && response.headers.has('content-type') && response.headers.get('content-type').includes('image/svg+xml')) {
            const svg = await response.text();
            console.log(svg);
            this.setState({svg});
        }

    }

    render = () => {
        return (<div>
            {this.state.svg && <div dangerouslySetInnerHTML={this.getSVG()} /> }
        </div>);
    }

    getSVG = () => ({
        __html: this.state.svg,
    });
}




