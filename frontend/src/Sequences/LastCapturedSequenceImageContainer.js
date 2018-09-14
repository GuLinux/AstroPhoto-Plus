import { connect } from 'react-redux';
import LastCapturedSequenceImage from './LastCapturedSequenceImage';
import { getSequenceEntitiesWithJobs } from './selectors';
import { imageUrlBuilder } from '../utils';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => {
    const sequenceEntity = getSequenceEntitiesWithJobs(state)[ownProps.sequence];
    const showLastImage = state.sequences.showLastImage;

    if(! sequenceEntity) {
        return { showLastImage };
    }
    const images = sequenceEntity.sequenceJobs
        .map(i => sequenceEntity.sequenceJobEntities[i])
        .filter(i => i.type === 'shots' && i.saved_images)
        .map(i => ({ sequenceJob: i.id, savedImages: i.saved_images}) )
        .reduce( (acc, cur) => [...acc, ...cur.savedImages], []);

    const type = 'main';
    const lastImageId = images.slice(-1)[0];
    const lastImage = images.length > 0 ? imageUrlBuilder(lastImageId, {
        type,
        maxWidth: 723,
        stretch: true,
        clipLow: 0,
        clipHigh: 0,
    }) : null;

    return { showLastImage, type, lastImage, lastImageId };
}


const mapDispatchToProps = (dispatch, props) => ({
    toggleShowLastImage: (showLastImage) => dispatch(Actions.Sequences.toggleShowLastImage(showLastImage)),
})


const LastCapturedSequenceImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LastCapturedSequenceImage);


export default LastCapturedSequenceImageContainer;
