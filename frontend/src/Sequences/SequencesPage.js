import React from 'react';
import PagesListContainer from '../Navigation/PagesListContainer';
import SequenceContainer from './SequenceContainer';
import SequenceItemContainer from '../SequenceItems/SequenceItemContainer';
import SequencesListContainer from './SequencesListContainer';

const SequencesPage = () => (
    <div className="sequences container">
        <PagesListContainer navigation="sequencesPage">
            <SequencesListContainer key="sequences" />
            <SequenceContainer key="sequence" />
            <SequenceItemContainer key="sequence-item" />
        </PagesListContainer>
    </div>
)
export default SequencesPage;


