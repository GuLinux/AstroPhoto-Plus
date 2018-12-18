import { connect } from 'react-redux'
import { ExposureSequenceJob } from './ExposureSequenceJob'
import { exposureSequenceJobSelector} from '../selectors'

export const ExposureSequenceJobContainer = connect(
    exposureSequenceJobSelector,
)(ExposureSequenceJob)
