import React from 'react'
import AddSequenceItem from '../components/AddSequenceItem';
import SequenceItemsContainer from '../containers/SequenceItemsContainer';
import { Button } from 'react-bootstrap';

const Sequence = ({ sequence, navigateBack, onCreateSequenceItem }) => {
    if(sequence === null)
        return null;
    return (
    <div>
        <h2>
            {sequence.name}
            <Button onClick={navigateBack} className="pull-right">Back</Button>
        </h2>
        <SequenceItemsContainer sequenceId={sequence.id} />
        <AddSequenceItem onCreateSequenceItem={onCreateSequenceItem} sequenceId={sequence.id} />
    </div>
)}

export default Sequence
