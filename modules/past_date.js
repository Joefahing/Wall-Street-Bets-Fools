class PastDate {
    static pastDay(n_days = 1) {
        const date = new Date();
        date.setDate(date.getDate() - n_days);
        return date;
    }

    static pastWeek(n_weeks = 1) {
        const date = new Date();
        date.setDate(date.getDate() - 7 * n_weeks);
        return date;
    }

    static pastMonth(n_month = 1) {
        const date = new Date();
        date.setMonth(date.getMonth() - n_month, date.getDate());
        return date;
    }
}

module.exports = PastDate;