import React from 'react';
import { ExposureSequenceJobContainer } from './Exposure/ExposureSequenceJobContainer'
import { NotFoundPage } from '../components/NotFoundPage';
import { get } from 'lodash';
import { Container } from 'semantic-ui-react';
import { FilterSequenceJobContainer } from './FilterWheel/FilterSequenceJobContainer';
import { CommandSequenceJob } from './Command/CommandSequenceJob';
import { INDIPropertySequenceJobContainer } from './INDIProperty/INDIPropertySequenceJobContainer';

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

