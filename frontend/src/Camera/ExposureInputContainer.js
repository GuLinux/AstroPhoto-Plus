import { connect } from 'react-redux';
import { setOption, shoot } from './actions';
import { ExposureInput } from './ExposureInput';
import { exposureInputSelector } from './selectors';

const onExposureChanged = (exposure, section) => setOption({exposure}, section);

const mapDispatchToProps = {
    onExposureChanged,
    shoot,
};


const ExposureInputContainer = connect(
    exposureInputSelector,
    mapDispatchToProps
)(ExposureInput);

export default ExposureInputContainer;
