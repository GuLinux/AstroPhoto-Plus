import React from 'react';
import { ExposureSequenceJobContainer } from './ExposureSequenceJobContainer'
import CommandSequenceJob from './CommandSequenceJob'
import { FilterSequenceJobContainer } from './FilterSequenceJobContainer'
import INDIPropertySequenceJobContainer from './INDIPropertySequenceJobContainer'
import { NotFoundPage } from '../components/NotFoundPage';
import { get } from 'lodash';
import { Container } from 'semantic-ui-react';

const mapItemType = sequenceJob => {
    switch(get(sequenceJob, 'type')) {
        case 'shots':
            return <ExposureSequenceJobContainer sequenceJob={sequenceJob} />;
        case 'filter':
            return <FilterSequenceJobContainer sequenceJob={sequenceJob} />;
        case 'command':
            return <CommandSequenceJob sequenceJob={sequenceJob} />;
        case 'property':
            return <INDIPropertySequenceJobContainer sequenceJob={sequenceJob} />;
        default:
            return <NotFoundPage backToUrl='/sequences/all' message='Sequence job not found' />;
        }
}

export const SequenceJob = ({sequenceJob}) => (
    <Container>
        {mapItemType(sequenceJob)}
    </Container>
)

