import React from 'react';
import Session from './Session';


const SessionsList = ({sessions, onCreateSequence}) => (
    <ul>
        {sessions.map(session => (
        <Session key={session.id} {...session} onCreateSequence={onCreateSequence} />
        ))}
    </ul>
)

export default SessionsList;
