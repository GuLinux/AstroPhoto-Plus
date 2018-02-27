import React from 'react'
import AddSequence from '../components/AddSequence';
import SequencesController from '../containers/SequencesController';
import { Button } from 'react-bootstrap';

const Session = ({ session, onCreateSequence, navigateBack }) => {
    if(session === null)
        return null;
    return (
    <div>
        <h2>
            {session.name}
            <Button onClick={navigateBack} className="pull-right">Back</Button>
        </h2>
        <SequencesController sessionId={session.id} />
        <AddSequence sessionId={session.id} onCreateSequence={onCreateSequence} />
    </div>
)}

export default Session
