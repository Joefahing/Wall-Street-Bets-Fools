function trimTimeFromDate(date = new Date()) {
    const hourLength = 2;
    const minuteSecondString = ':00:00';

    const dateString = date.toISOString();
    const positionOfT = dateString.indexOf('T', 0) + 1
    const newDateString = dateString.substring(0, positionOfT + hourLength) + minuteSecondString;

    return newDateString;
}

function isInterval(interval = 'week') {
    const set = new Set(['week', 'day', 'month']);
    return set.has(interval);
}

module.exports.trimTimeFromDate = trimTimeFromDate;
module.exports.isInterval = isInterval;