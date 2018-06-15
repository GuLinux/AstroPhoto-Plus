import { connect } from 'react-redux';
import Actions from '../actions';
import ExposureInput from './ExposureInput';
import { getShotParameters } from './selectors';


const mapStateToProps = (state) => ({
    shotParameters: getShotParameters(state),
});


const mapDispatchToProps = dispatch => ({
    onExposureChanged: (exposure) => dispatch(Actions.Camera.setExposure(exposure)),
    onShoot: (shotParameters) => dispatch(Actions.Camera.shoot(shotParameters)),
});


const ExposureInputContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ExposureInput);

export default ExposureInputContainer;
