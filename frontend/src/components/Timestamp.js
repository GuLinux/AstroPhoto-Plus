import React from 'react';

// TODO: proper compact format
const Timestamp = ({ts}) => <span>{new Date(ts * 1000).toISOString()}</span>;

export default Timestamp;

