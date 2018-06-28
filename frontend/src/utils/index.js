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

