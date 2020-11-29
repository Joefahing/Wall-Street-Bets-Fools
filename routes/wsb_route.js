const express = require('express');
const wsb = require('../modules/wsb');
const PastTimestamp = require('../modules/past_date');

const router = express.Router();

function invalidBodyPropertiesHandler(error, req, res, next) {
    if (error.from === 'add_post') {
        res.status(400).json({
            message: `Invalid Body Properties`
        });
    }
    else {
        next(error);
    }
}

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome fools, you ready to lose some money?'
    });
});

router.get('/gain_loss/post', async (req, res, next) => {
    const time_interval = req.query.interval;

    if (!time_interval) next({
        from: 'get_post',
    })

    else {
        let current_interval_end_date = new Date();
        let current_interval_start_date;
        let previous_interval_end_date;
        let previous_interval_start_date;
        const pastBy = 1;


        switch (time_interval) {
            case 'day':
                current_interval_start_date = PastTimestamp.pastDay();
                previous_interval_end_date = PastTimestamp.pastDay(current_interval_end_date, pastBy);
                previous_interval_start_date = PastTimestamp.pastDay(current_interval_start_date, pastBy);
                break;

            case 'week':
                current_interval_start_date = PastTimestamp.pastWeek();
                previous_interval_end_date = PastTimestamp.pastWeek(current_interval_end_date, pastBy);
                previous_interval_start_date = PastTimestamp.pastWeek(current_interval_start_date, pastBy);
                break;

            case 'month':
                current_interval_start_date = PastTimestamp.pastMonth();
                previous_interval_end_date = PastTimestamp.pastMonth(current_interval_end_date, pastBy);
                previous_interval_start_date = PastTimestamp.pastMonth(current_interval_start_date, pastBy);
                break
        }

        const currentGainLossPosts = await wsb.getAllGainLossPost(current_interval_start_date, current_interval_end_date);

        // const previousGainLossPosts = await wsb.getAllGainLossPost(
        //     previous_interval_start_date, previous_interval_end_date);

        const gainLossSummary = await wsb.getGainLossSummary(time_interval);

        const result = {
            summary: gainLossSummary,
            date_used: {
                interval: time_interval,
                start_date: current_interval_start_date,
                end_date: current_interval_end_date
            },
            posts: currentGainLossPosts,
        }

        console.log(result);

        res.status(200).json(result)
    }

});

router.get('/gain_loss/summary', async (req, res) => {
    const summary = await wsb.getGainLossSummary('week');
    console.log(summary);
    res.status(200).json(summary);
});

router.get('/stock/top', async (req, res) => {
    const result = await wsb.getTopNStocks();
    res.json({
        top_stock: result
    });
});

router.post('/add_post', async (req, res, next) => {
    if (!req.body.search || !Number.isInteger(parseInt(req.body.search))) {
        next({
            from: 'add_post'
        });
    }
    else {
        const addedPost = await wsb.addPostAndStockPost(parseInt(req.body.search));
        res.status(200).json({
            post_added: addedPost.length
        });
    }
});

module.exports = router;