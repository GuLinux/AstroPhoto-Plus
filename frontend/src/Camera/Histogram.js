import React from 'react';

class Histogram extends React.Component {
    render = () => {
        const { histogramEnabled, histogram } = this.props;
        if(!histogramEnabled) {
            return null;
        }
        // TODO: view histogram
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
