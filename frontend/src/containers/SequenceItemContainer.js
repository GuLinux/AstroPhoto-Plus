import { connect } from 'react-redux'
import SequenceItem from '../components/SequenceItem'


const mapStateToProps = (state) => {
    let sequenceItemId = state.navigation.sequencesPage.sequenceItemID;

    if(!(sequenceItemId in state.sequenceItems)) {
        return { sequenceItem: null }
    }
    let sequenceItem = state.sequenceItems[sequenceItemId];
    return {sequenceItem}
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
}

const SequenceItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SequenceItem)

export default SequenceItemContainer

