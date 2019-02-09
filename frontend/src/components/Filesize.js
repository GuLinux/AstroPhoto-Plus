import React from 'react';

export const formatBytes = (bytes, precision) => {
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

export const Filesize = ({bytes, precision=2, as='span'}) => {
    let size = 'unknown';
    const Element = as;
    if(bytes)
        size = formatBytes(bytes, precision);
    return <Element>{size}</Element>
}


