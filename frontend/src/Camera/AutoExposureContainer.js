import { connect } from 'react-redux';
import React from 'react';
import { shoot } from './actions';
import { autoExposureSelector } from './selectors';


class AutoExposure extends React.Component {
    render = () => null;
     
    componentDidUpdate = (prevProps) => {
        const {shouldAutostart, shotParameters, shoot} = this.props;

        if(shouldAutostart && ! prevProps.shouldAutostart) {
            shoot(shotParameters);
        }
    }
}

export const AutoExposureContainer = connect(autoExposureSelector, { shoot })(AutoExposure);
