import { connect } from 'react-redux'
import SequenceItem from '../components/SequenceItem'
import Actions from '../actions'


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
        saveSequenceItem: (sequenceItem) => dispatch(Actions.SequenceItems.saveSequenceItem(sequenceItem)),
    }
}

const SequenceItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SequenceItem)

export default SequenceItemContainer

