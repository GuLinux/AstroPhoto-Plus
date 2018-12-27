import { connect } from 'react-redux';
import { LastCapturedSequenceImage } from './LastCapturedSequenceImage';
import { lastCapturedSequenceImageSelector } from './selectors';
import Actions from '../actions';

const mapDispatchToProps = {
    toggleShowLastImage: Actions.Sequences.toggleShowLastImage,
}


const LastCapturedSequenceImageContainer = connect(
    lastCapturedSequenceImageSelector,
    mapDispatchToProps
)(LastCapturedSequenceImage);


export default LastCapturedSequenceImageContainer;
