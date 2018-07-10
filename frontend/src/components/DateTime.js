import React from 'react';

// `locale` and `options` are specific to toLocaleString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
const DateTime = ({timestamp, milliseconds, dateString, locale, options}) => {
    let date;
    if(timestamp)
        date = new Date(timestamp*1000);
    else if(milliseconds)
        date = new Date(milliseconds);
    else if(dateString)
        date = new Date(dateString);
    else
        date = new Date(); // default to current time
    return <span>{date.toLocaleString(locale, options)}</span>;
}

export default DateTime;

