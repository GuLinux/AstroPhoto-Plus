import React from 'react'
import AddSequenceItem from '../components/AddSequenceItem';
import SequenceItemsContainer from '../containers/SequenceItemsContainer';
import { Button, ButtonGroup } from 'react-bootstrap';

const Sequence = ({ sequence, navigateBack, onCreateSequenceItem }) => {
    if(sequence === null)
        return null;
    return (
    <div>
        <h2>
            {sequence.name}
            <ButtonGroup className="pull-right">
                <Button onClick={navigateBack} bsSize="xsmall">back</Button>
                <Button bsStyle="primary" bsSize="xsmall">new</Button>
            </ButtonGroup>
        </h2>
        <SequenceItemsContainer sequenceId={sequence.id} />
        <AddSequenceItem onCreateSequenceItem={onCreateSequenceItem} sequenceId={sequence.id} />
    </div>
)}

export default Sequence
