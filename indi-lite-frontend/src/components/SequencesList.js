import React from 'react';


const SequencesList = ({sequences}) => (
    <ul>
        {sequences.map(sequence => (
        <p key={sequence.id}>{sequence.name}</p>
        ))}
    </ul>
)

export default SequencesList;
