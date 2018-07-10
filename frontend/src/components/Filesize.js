import React from 'react';

const formatBytes = (bytes, precision) => {
    let current = bytes;
    if(current < 1024)
        return `${current.toFixed(precision)} bytes`;
    current /= 1024;
    if(current < 1024)
        return `${current.toFixed(precision)} KB`;
    current /= 1024;
    if(current < 1024)
        return `${current.toFixed(precision)} MB`;
    current /= 1024;
    return `${current.toFixed(precision)} GB`;
}

const Filesize = ({bytes, precision=2}) => {
    let size = 'unknown';
    if(bytes)
        size = formatBytes(bytes, precision);
    return <span>{size}</span>
}


export default Filesize;
