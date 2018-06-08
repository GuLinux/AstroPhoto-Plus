import { connect } from 'react-redux'
import SequenceItem from './SequenceItem'


const mapStateToProps = (state, ownProps) => {
    let sequenceItemId = ownProps.sequenceItemId;
    let hasSequenceItem = sequenceItemId in state.sequenceItems;
    if(!hasSequenceItem) {
        return { sequenceItem: null }
    }
    let sequenceItem = state.sequenceItems[sequenceItemId];
    return {sequenceItem}
}

const mapDispatchToProps = (dispatch, props) => ({})

const SequenceItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SequenceItem)

export default SequenceItemContainer
