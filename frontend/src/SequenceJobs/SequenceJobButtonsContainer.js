import { connect } from 'react-redux'
import Actions from '../actions'
import SequenceJobButtons from './SequenceJobButtons'



const mapDispatchToProps = {
    onSave: Actions.SequenceJobs.saveSequenceJob,
}


const SequenceJobButtonsContainer = connect(
    null,
    mapDispatchToProps,
)(SequenceJobButtons)

export default SequenceJobButtonsContainer
