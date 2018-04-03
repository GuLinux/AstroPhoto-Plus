import ShowModalButton from './ShowModalButton';
import React from 'react';
import PagesListContainer from '../containers/PagesListContainer';
import SequenceContainer from '../containers/SequenceContainer';
import SequencesListContainer from '../containers/SequencesListContainer';
import AddSequenceModalContainer from '../containers/AddSequenceModalContainer';

const SequencesPage = ({sequences, onSequenceEdit, onAddSequence, onSequenceDelete}) => 
(
    <div className="sequences container-fluid">
        <PagesListContainer navigationKey="sequencePage">
            <div key="sequences">
                <ShowModalButton className="pull-right" createModal={ (visible, close) => <AddSequenceModalContainer show={visible} closeModal={close} /> }  />
                <SequencesListContainer />
            </div>
            <SequenceContainer key="sequence" />
        </PagesListContainer>
    </div>
)

export default SequencesPage;


