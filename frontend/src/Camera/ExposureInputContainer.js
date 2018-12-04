import { connect } from 'react-redux';
import Actions from '../actions';
import ExposureInput from './ExposureInput';
import { getShotParameters } from './selectors';
import  { connectedCamerasSelector } from '../Gear/selectors';


const mapStateToProps = (state) => {
    const shotParameters = getShotParameters(state);
    const cameraObject = shotParameters.camera && connectedCamerasSelector(state).get(shotParameters.camera.id);
    return {
        shotParameters,
        isShooting: state.camera.isShooting,
        cameraExposureValue: cameraObject && cameraObject.exposureProperty.values[0],
    }
};

const onExposureChanged = exposure => Actions.Camera.setOption({exposure});

const mapDispatchToProps = {
    onExposureChanged,
    onShoot: Actions.Camera.shoot,
};


const ExposureInputContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ExposureInput);

export default ExposureInputContainer;
