import React from 'react'
import ModalContainer from '../containers/ModalContainer'
import AddSequenceItemModal from './AddSequenceItemModal'
import SequenceItemsContainer from '../containers/SequenceItemsContainer';
import { Button, ButtonGroup } from 'react-bootstrap';
import { canStart } from '../models/sequences'

const Sequence = ({sequence, onCreateSequenceItem, navigateBack, startSequence}) => {
    if(sequence === null)
        return null;
    return (
    <div>
        <h2>
            {sequence.name}
            <ButtonGroup className="pull-right">
                <Button onClick={navigateBack} bsSize="xsmall">back</Button>
                <Button onClick={() => startSequence()} bsSize="xsmall" bsStyle="success" disabled={!canStart(sequence)}>start</Button>
                <ModalContainer.Open modal="newSequenceItem" bsStyle="info" bsSize="xsmall" className="pull-right" disabled={!canStart(sequence)}>new</ModalContainer.Open>
            </ButtonGroup>
        </h2>
        <ModalContainer name="newSequenceItem">
            <AddSequenceItemModal modalName="newSequenceItem" onAddSequenceItem={onCreateSequenceItem} />
        </ModalContainer>
        <SequenceItemsContainer sequenceId={sequence.id} />
    </div>
)}


export default Sequence
