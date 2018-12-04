import { connect } from 'react-redux';
import React from 'react';
import Actions from '../actions';
import { getShotParameters } from './selectors';

// TODO: remove this component by using getState in actions
const mapStateToProps = (state) => ({
    shotParameters: getShotParameters(state),
    shouldAutostart: state.camera.shouldAutostart,
});


const mapDispatchToProps = {
    shoot: Actions.Camera.shoot,
};

class AutoExposure extends React.Component {
    render = () => null;
     
    componentDidUpdate = (prevProps) => {
        const {shouldAutostart, shotParameters, shoot} = this.props;

        if(shouldAutostart && ! prevProps.shouldAutostart) {
            shoot(shotParameters);
        }
    }
}

const AutoExposureContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AutoExposure);

export default AutoExposureContainer;
