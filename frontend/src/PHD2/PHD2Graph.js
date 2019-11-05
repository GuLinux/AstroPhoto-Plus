import React from 'react';
import { connect } from 'react-redux';
import { phd2GraphSelector } from './selectors';
import { Label as RechartsLabel, LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Label } from 'semantic-ui-react';

class PHD2GraphComponent extends React.Component {
    timestampFormatter = n => Number.parseFloat(n).toFixed(1);

    render = () => {
        if(this.props.guideSteps.length === 0) {
            return null;
        }
        return (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={this.props.guideSteps}>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dt" tickFormatter={this.timestampFormatter}>
                    <RechartsLabel position='insideBottomRight' >Time</RechartsLabel>
                  </XAxis>
                  <YAxis>
                    <RechartsLabel position='insideLeft' angle={270}>Delta</RechartsLabel>
                  </YAxis>
                  <Tooltip />
                  <Legend verticalAlign='top' />
                  <Line type="monotone" dataKey="dx" stroke="blue" name='Right Ascension' isAnimationActive={false} />
                  <Line type="monotone" dataKey="dy" stroke="red" name='Declination' isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    };
}


export const PHD2Graph = connect(phd2GraphSelector, {})(PHD2GraphComponent);

