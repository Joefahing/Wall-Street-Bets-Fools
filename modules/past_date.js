class PastTimestamp {

    static PastDay(reference_date = new Date(), n_days = 1) {
        const start_date = new Date(Date.parse(reference_date));
        start_date.setDate(start_date.getDate() - n_days);
        return date;
    }

    static PastWeek(reference_date = new Date(), n_weeks = 1) {
        const start_date = new Date(Date.parse(reference_date));
        start_date.setDate(start_date.getDate() - 7 * n_weeks);
        return start_date;
    }

    static PastMonth(reference_date = new Date(), n_month = 1) {
        const start_date = new Date(Date.parse(reference_date));
        start_date.setMonth(start_date.getMonth() - n_month, start_date.getDate());
        return start_date;
    }
}

module.exports = PastTimestamp;