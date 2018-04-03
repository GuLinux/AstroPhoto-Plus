import AddSequence from '../components/AddSequence';
import React from 'react';
import PagesListContainer from '../containers/PagesListContainer';
import SequenceContainer from '../containers/SequenceContainer';
import SequencesListContainer from '../containers/SequencesListContainer'

const SequencesPage = ({sequences, onSequenceEdit, onAddSequence, onSequenceDelete}) => 
(
    <div className="sequences container-fluid">
        <PagesListContainer navigationKey="sequencePage">
            <div key="sequences">
                <AddSequence className="pull-right"/>
                <SequencesListContainer />
            </div>
            <SequenceContainer key="sequence" />
        </PagesListContainer>
    </div>
)

export default SequencesPage;


