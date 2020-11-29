class PastTimestamp {

    static pastDay(reference_date = new Date(), n_days = 1) {
        const date = new Date(Date.parse(reference_date));
        date.setDate(date.getDate() - n_days);
        return date;
    }

    static pastWeek(reference_date = new Date(), n_weeks = 1) {
        const date = new Date(Date.parse(reference_date));
        date.setDate(date.getDate() - 7 * n_weeks);
        return date;
    }

    static pastMonth(reference_date = new Date(), n_month = 1) {
        const date = new Date(Date.parse(reference_date));
        date.setMonth(date.getMonth() - n_month, date.getDate());
        return date;
    }
}

module.exports = PastTimestamp;