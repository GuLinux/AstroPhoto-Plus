import React from 'react';
import { Loader, Header, Container} from 'semantic-ui-react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

class Histogram extends React.Component {
    render = () => {
        const { histogramEnabled, histogram, logarithmic } = this.props;
        if(!histogramEnabled || ! histogram) {
            return null;
        }
        if(histogram.loading)
            return (
                <Container fluid>
                    <Header size='large' content='Histogram' />
                    <Loader inline size='large' />
                </Container>
            );
        let data = histogram.values.map((v, index) => ({
            bin: index,
            name: `${histogram.bins[index]}-${histogram.bins[index+1]}}`,
            number: logarithmic? v+1 : v,
        }));
        return (
            <Container fluid>
                <Header size='large' content='Histogram' />
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis hide dataKey="bin" />
                      <YAxis hide datakey='number' scale={logarithmic ? 'log' : 'linear'} domain={['auto', 'auto']} allowDataOverflow />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="number" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </Container>
        );
    }

    componentDidMount = () => this.loadHistogram();
    componentDidUpdate = (prevProps) => {
        this.loadHistogram(prevProps.bins !== this.props.bins);
    }
    loadHistogram = (updated) =>
        this.props.histogramEnabled &&
        this.props.image &&
        (!this.props.histogram || updated) &&
        this.props.loadHistogram(this.props.camera, this.props.image, this.props.bins);
}

export default Histogram;
