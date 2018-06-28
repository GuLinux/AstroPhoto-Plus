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

    const lastImage = images.length > 0 ? imageUrlBuilder(images.slice(-1)[0], {
        type: 'main',
        maxWidth: 500,
        stretch: true,
        clipLow: 0,
        clipHigh: 100,
    }) : null;

    return { lastImage };
}


const mapDispatchToProps = (dispatch, props) => ({
})


const LastCapturedSequenceImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LastCapturedSequenceImage);


export default LastCapturedSequenceImageContainer;
