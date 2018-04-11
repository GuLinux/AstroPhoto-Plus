import React from 'react'
import ModalContainer from '../containers/ModalContainer'
import AddSequenceItemModal from './AddSequenceItemModal'
import SequenceItemsContainer from '../containers/SequenceItemsContainer';
import { Button, ButtonGroup } from 'react-bootstrap';

const Sequence = ({sequence, onCreateSequenceItem, navigateBack}) => {
    if(sequence === null)
        return null;
    return (
    <div>
        <h2>
            {sequence.name}
            <ButtonGroup className="pull-right">
                <Button onClick={navigateBack} bsSize="xsmall">back</Button>
                <ModalContainer.Open modal="newSequenceItem" bsStyle="primary" bsSize="xsmall" className="pull-right">new</ModalContainer.Open>
            </ButtonGroup>
        </h2>
        <ModalContainer name="newSequenceItem">
            <AddSequenceItemModal modalName="newSequenceItem" onAddSequenceItem={(type) => onCreateSequenceItem(type, sequence.id)} />
        </ModalContainer>
        <SequenceItemsContainer sequenceId={sequence.id} />
    </div>
)}


export default Sequence
