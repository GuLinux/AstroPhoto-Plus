import React from 'react'
import AddSequence from '../components/AddSequence';
import VisibleSequences from '../containers/VisibleSequences';
import { Button } from 'react-bootstrap';

const Session = ({ session, onCreateSequence, navigateBack }) => {
    if(session === null)
        return null;
    return (
  <div>
    {session.name}
        <VisibleSequences sessionId={session.id} />
        <AddSequence sessionId={session.id} onCreateSequence={onCreateSequence} />
        <Button onClick={navigateBack}>Back</Button>
  </div>
)}

export default Session
