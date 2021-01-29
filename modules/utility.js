function trimTimeFromDate(date = new Date()) {
    const dateString = date.toISOString();
    const positionOfT = dateString.indexOf('T', 0)
    const newDateString = dateString.substring(0, positionOfT);

    return newDateString;
}

module.exports.trimTimeFromDate = trimTimeFromDate