import { connect } from 'react-redux';
import LastCapturedSequenceImage from './LastCapturedSequenceImage';
import { getSequenceEntitiesWithItems } from './selectors';

const mapStateToProps = (state, ownProps) => {
    console.log(getSequenceEntitiesWithItems(state)[ownProps.sequence]);
    const sequenceEntity = getSequenceEntitiesWithItems(state)[ownProps.sequence];

    if(! sequenceEntity) {
        return { sequenceEntity };
    }
    const images = sequenceEntity.sequenceItems
        .map(i => sequenceEntity.sequenceItemEntities[i])
        .filter(i => i.type === 'shots' && i.last_captured)
        .map(i => ({ sequenceItem: i.id, lastImage: i.last_captured}) );

    return { images };
}


const mapDispatchToProps = (dispatch, props) => ({
})


const LastCapturedSequenceImageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LastCapturedSequenceImage);


export default LastCapturedSequenceImageContainer;
