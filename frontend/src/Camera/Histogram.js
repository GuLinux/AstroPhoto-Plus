import React from 'react';
import { Loader } from 'semantic-ui-react';

class Histogram extends React.Component {
    render = () => {
        const { histogramEnabled, histogram } = this.props;
        if(!histogramEnabled || ! histogram) {
            return null;
        }

        if(histogram.loading)
            return <Loader inline />
        return null;
    }

    componentDidMount = () => this.loadHistogram();
    componentDidUpdate = () => this.loadHistogram();
    loadHistogram = () =>
        this.props.histogramEnabled &&
        this.props.image &&
        !this.props.histogram &&
        this.props.loadHistogram(this.props.camera, this.props.image, this.props.bins);
}

export default Histogram;
