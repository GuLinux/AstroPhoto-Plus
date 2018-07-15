import { connect } from 'react-redux';
import LastCapturedSequenceImage from './LastCapturedSequenceImage';
import { getSequenceEntitiesWithItems } from './selectors';
import { imageUrlBuilder } from '../utils';

const mapStateToProps = (state, ownProps) => {
    const sequenceEntity = getSequenceEntitiesWithItems(state)[ownProps.sequence];

    if(! sequenceEntity) {
        return {};
    }
    const images = sequenceEntity.sequenceItems
        .map(i => sequenceEntity.sequenceItemEntities[i])
        .filter(i => i.type === 'shots' && i.saved_images)
        .map(i => ({ sequenceItem: i.id, savedImages: i.saved_images}) )
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

    return { type, lastImage, lastImageId };
}


const mapDispatchToProps = (dispatch, props) => ({
})


const LastCapturedSequenceImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LastCapturedSequenceImage);


export default LastCapturedSequenceImageContainer;
