export const sanitizePath = (name) => name.replace('/', '-');

export const secs2time = seconds => {
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
}


export const listsEquals = (first, second) => first.length === second.length && first.map((i, index) => second[index] === i).reduce( (acc, current) => acc && current, true)

export const unsortedListsEquals = (first, second) => listsEquals(first.concat().sort(), second.concat().sort())
