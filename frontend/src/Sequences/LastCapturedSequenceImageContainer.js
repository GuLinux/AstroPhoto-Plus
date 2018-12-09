import { connect } from 'react-redux';
import LastCapturedSequenceImage from './LastCapturedSequenceImage';
import { lastCapturedSequenceImageSelector } from './selectors';
import { imageUrlBuilder } from '../utils';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => lastCapturedSequenceImageSelector(ownProps.sequenceId);

const mapDispatchToProps = {
    toggleShowLastImage: Actions.Sequences.toggleShowLastImage,
}


const LastCapturedSequenceImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LastCapturedSequenceImage);


export default LastCapturedSequenceImageContainer;
