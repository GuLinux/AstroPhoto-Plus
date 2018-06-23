import { connect } from 'react-redux';
import Actions from '../actions';
import ExposureInput from './ExposureInput';
import { getShotParameters } from './selectors';
import  { getConnectedCameraObjects } from '../Gear/selectors';


const mapStateToProps = (state) => {
    const shotParameters = getShotParameters(state);
    const cameraObject = shotParameters.camera && getConnectedCameraObjects(state).find(c => c.id === shotParameters.camera.id);
    return {
        shotParameters,
        isShooting: state.camera.isShooting,
        cameraExposureValue: cameraObject && cameraObject.exposureProperty.values[0],
    }
};


const mapDispatchToProps = dispatch => ({
    onExposureChanged: (exposure) => dispatch(Actions.Camera.setOption({exposure})),
    onShoot: (shotParameters) => dispatch(Actions.Camera.shoot(shotParameters)),
});


const ExposureInputContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ExposureInput);

export default ExposureInputContainer;
