import { connect } from 'react-redux'
import SequenceJob from './SequenceJob'


const mapStateToProps = (state, ownProps) => {
    let sequenceJobId = ownProps.sequenceJobId;
    let hasSequenceJob = sequenceJobId in state.sequenceItems;
    if(!hasSequenceJob) {
        return { sequenceJob: null }
    }
    let sequenceJob = state.sequenceItems[sequenceJobId];
    return {sequenceJob}
}

const mapDispatchToProps = (dispatch, props) => ({})

const SequenceJobContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SequenceJob)

export default SequenceJobContainer
