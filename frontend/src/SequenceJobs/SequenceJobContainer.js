import { connect } from 'react-redux'
import { SequenceJob } from './SequenceJob'
import { sequenceJobSelector } from './selectors';


const SequenceJobContainer = connect(
    sequenceJobSelector,
)(SequenceJob)

export default SequenceJobContainer
