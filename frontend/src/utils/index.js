import PRINTJ from 'printj'


export const sanitizePath = (name) => name.replace('/', '-');

export const secs2time = seconds => {
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
}


export const listsEquals = (first, second) => first.length === second.length && first.map((i, index) => second[index] === i).reduce( (acc, current) => acc && current, true)

export const unsortedListsEquals = (first, second) => listsEquals(first.concat().sort(), second.concat().sort())

export const filterChildren = (object, filter) => {
    let copy = {...object};
    Object.keys(object).forEach( key => filter(object[key]) || delete copy[key]);
    return copy;
}

export const list2object = (list, keyField) => list.reduce( (acc, current) => ({...acc, [current[keyField]]: current}), {});

export const imageUrlBuilder = (id, options) =>
    `/api/images/${options.type}/${id}?maxwidth=${options.maxWidth || 0}&stretch=${options.stretch ? 1 : 0}` +
    `&format=${options.format || 'png'}&clip_low=${options.clipLow}&clip_high=${options.clipHigh}`;


const getMinimumDisplayValue = (format, maxDigits=6) => {
    for(let i=maxDigits; i>0; i--) {
        const value = Math.pow(10, -1 * i);
        const formatValue = PRINTJ.sprintf(format, value).trim();
        const referenceValue = PRINTJ.sprintf('%0.*f', i, value);
        if( formatValue === referenceValue)
            return value;
    }
    return 1;
}
export const formatDecimalNumber = (format, value) => {
    let minFormat = format;
    if(value !== 0 && ! isNaN(value)) {
        const minimumFormatValue = getMinimumDisplayValue(format, 6);
        if(value < minimumFormatValue)
            minFormat = '%f';
    }
    return PRINTJ.sprintf(minFormat, value).trim();
}
