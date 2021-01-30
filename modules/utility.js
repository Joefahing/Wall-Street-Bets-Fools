function trimTimeFromDate(date = new Date()) {
    date.setSeconds(0, 0);
    return date.getTime();
}

function isInterval(interval = 'week') {
    const set = new Set(['week', 'day', 'month']);
    return set.has(interval);
}

module.exports.trimTimeFromDate = trimTimeFromDate;
module.exports.isInterval = isInterval;