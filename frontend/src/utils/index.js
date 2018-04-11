export const sanitizePath = (name) => name.replace('/', '-');

export const secs2time = seconds => {
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
}


