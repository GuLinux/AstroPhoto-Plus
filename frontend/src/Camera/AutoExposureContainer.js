import { connect } from 'react-redux';
import React from 'react';
import Actions from '../actions';
import { getShotParameters } from './selectors';



const mapStateToProps = (state) => ({
    shotParameters: getShotParameters(state),
    shouldAutostart: state.camera.shouldAutostart,
});


const mapDispatchToProps = dispatch => ({
    shoot: (shotParameters) => dispatch(Actions.Camera.shoot(shotParameters)),
});

class AutoExposure extends React.Component {
    render = () => null;
     
    componentDidUpdate = () => {
        const {shouldAutostart, shotParameters, shoot} = this.props;
        if(shouldAutostart) {
            shoot(shotParameters);
        }
    }
}

const AutoExposureContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AutoExposure);

export default AutoExposureContainer;
