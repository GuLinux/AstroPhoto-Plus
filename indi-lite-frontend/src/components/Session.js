import React from 'react'
import AddSequence from '../components/AddSequence';
import SequencesContainer from '../containers/SequencesContainer';
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
        <SequencesContainer sessionId={session.id} />
        <AddSequence sessionId={session.id} onCreateSequence={onCreateSequence} />
    </div>
)}

export default Session
