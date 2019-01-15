import { connect } from 'react-redux'
import Actions from '../actions'
import { SequenceJobButtons } from './SequenceJobButtons'
import { withRouter } from 'react-router';

const mapDispatchToProps = {
    onSave: Actions.SequenceJobs.saveSequenceJob,
}

export const SequenceJobButtonsContainer = withRouter(connect(
    null,
    mapDispatchToProps,
)(SequenceJobButtons))

