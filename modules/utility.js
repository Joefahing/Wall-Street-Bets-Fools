exports.trimMinuteFromDate = function (date = new Date(), setSecond = false) {

    const indexOfMinute = 6
    const isoString = date.toISOString();
    const dateString = setSecond
        ? isoString.substring(0, isoString.indexOf('T') + indexOfMinute) + ':00Z'
        : isoString.substring(0, isoString.indexOf('T') + 4) + '00:00Z';
    const newDate = new Date(dateString);

    return newDate.getTime();
}

exports.trimTimeFromDate = function (date = new Date()) {
    const isoString = date.toISOString();
    const dateString = isoString.substring(0, isoString.indexOf('T')) + 'T00:00:00Z';
    const newDate = new Date(dateString);

    return newDate.getTime();
}

exports.isInterval = function (interval = 'week') {
    const set = new Set(['week', 'day', 'month']);

    return set.has(interval);
}
