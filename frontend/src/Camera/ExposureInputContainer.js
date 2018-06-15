import { connect } from 'react-redux';
import Actions from '../actions';
import ExposureInput from './ExposureInput';
import { getCurrentCamera } from './selectors';


const mapStateToProps = (state) => ({
    shotParameters: {
        camera: getCurrentCamera(state),
        exposure: state.camera.exposure,
    },
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
     
