function trimTimeFromDate(date = new Date(), setSecond = false) {

    const indexOfMinute = 6
    const isoString = date.toISOString();
    const dateString = setSecond
        ? isoString.substring(0, isoString.indexOf('T') + indexOfMinute) + ':00'
        : isoString.substring(0, isoString.indexOf('T'));
    const newDate = new Date(dateString);

    return newDate.getTime();
}

function isInterval(interval = 'week') {
    const set = new Set(['week', 'day', 'month']);

    return set.has(interval);
}

module.exports.trimTimeFromDate = trimTimeFromDate;
module.exports.isInterval = isInterval;