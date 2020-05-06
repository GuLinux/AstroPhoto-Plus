import { connect } from 'react-redux';
import Actions from '../actions';
import { ExposureInput } from './ExposureInput';
import { exposureInputSelector } from './selectors';

const onExposureChanged = exposure => Actions.Camera.setOption({exposure});

const mapDispatchToProps = {
    onExposureChanged,
    shoot: Actions.Camera.shoot,
};


const ExposureInputContainer = connect(
    exposureInputSelector,
    mapDispatchToProps
)(ExposureInput);

export default ExposureInputContainer;
