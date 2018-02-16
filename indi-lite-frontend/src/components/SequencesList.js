import React from 'react';


const SequencesList = ({sequences}) => {
    <ul>
        {sequences.map(sequence => (
        <p>{sequence.name}</p>
        ))}
    </ul>
}

export default SequencesList;
