import React from 'react';
import PagesListContainer from '../containers/PagesListContainer';
import SequenceContainer from '../containers/SequenceContainer';
import SequenceItemContainer from '../containers/SequenceItemContainer';
import SequencesListContainer from '../containers/SequencesListContainer';

const SequencesPage = () => (
    <div className="sequences container-fluid">
        <PagesListContainer navigation="sequencesPage">
            <SequencesListContainer key="sequences" />
            <SequenceContainer key="sequence" />
            <SequenceItemContainer key="sequence-item" />
        </PagesListContainer>
    </div>
)
export default SequencesPage;


