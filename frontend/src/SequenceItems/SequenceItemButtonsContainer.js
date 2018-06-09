import { connect } from 'react-redux'
import Actions from '../actions'
import SequenceItemButtons from './SequenceItemButtons'


const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSave: (sequenceItem, onSaved) => dispatch(Actions.SequenceItems.saveSequenceItem(sequenceItem, onSaved)),
    }
}


const SequenceItemButtonsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SequenceItemButtons)

export default SequenceItemButtonsContainer
