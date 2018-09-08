import React from 'react';
import { Grid, Segment, Label, Loader, Header, Container} from 'semantic-ui-react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';


const HistogramTooltip = ({payload, logarithmic}) => {
    if(payload.length === 0)
        return null;
    const { bin, name, number} = payload[0].payload;
    const displayNumber = logarithmic ? number-1 : number;
    const displayRange = name;
    return (
        <div className="rechart-default-tooltip" >
            <p>bin: {bin}</p>
            <p>range: {displayRange}</p>
            <p className='rechart-tooltip-label'>number: {displayNumber}</p>
        </div>
    );
}

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
        const min = Math.min(...histogram.values);
        const max = Math.max(...histogram.values);
        return (
            <Container fluid>
                <Header size='large' content='Histogram' />
                <Segment>
                    <Grid divided columns={4} verticalAlign='middle'>
                            <Grid.Column><Label content='min: ' /></Grid.Column>
                            <Grid.Column>{min}</Grid.Column>
                            <Grid.Column><Label content='max: ' /></Grid.Column>
                            <Grid.Column>{max}</Grid.Column>
                    </Grid>
                </Segment>

                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis hide dataKey="bin" />
                      <YAxis hide datakey='number' scale={logarithmic ? 'log' : 'linear'} domain={['auto', 'auto']} allowDataOverflow />
                      <Tooltip content={<HistogramTooltip logarithmic={logarithmic} />}/>
                      <Legend />
                      <Line type="monotone" dataKey="number" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </Container>
        );
    }

    componentDidMount = () => {
        this.loadHistogram();
    }
    componentDidUpdate = (prevProps) => {
        this.loadHistogram(prevProps.bins !== this.props.bins || prevProps.image !== this.props.image || prevProps.camera !== this.props.camera);
    }
    loadHistogram = (updated) =>
        this.props.histogramEnabled &&
        this.props.image &&
        (!this.props.histogram || updated) &&
        this.props.loadHistogram(this.props.image, this.props.bins);
}

export default Histogram;
