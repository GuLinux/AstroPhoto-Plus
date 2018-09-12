import { connect } from 'react-redux'
import Actions from '../actions'
import SequenceJobButtons from './SequenceJobButtons'


const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSave: (sequenceJob, onSaved) => dispatch(Actions.SequenceJobs.saveSequenceJob(sequenceJob, onSaved)),
    }
}


const SequenceJobButtonsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SequenceJobButtons)

export default SequenceJobButtonsContainer
