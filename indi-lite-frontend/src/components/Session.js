import React from 'react'
import AddSequence from '../components/AddSequence';
import VisibleSequences from '../containers/VisibleSequences';

const Session = ({ id, name, onCreateSequence }) => (
  <li>
    {name}
        <VisibleSequences sessionId={id} />
        <AddSequence sessionId={id} onCreateSequence={onCreateSequence} />
  </li>
)

export default Session
