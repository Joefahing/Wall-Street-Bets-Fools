const express = require('express');
const wsb_controller = require('../controllers/wsb_controller');
const utility = require('../modules/utility');

const router = express.Router();

router.get('/profit/:interval', async (req, res, next) => {
    const interval = req.params.interval;

    if (!utility.isInterval(interval)) {
        next({
            error_type: 'invalid param'
        });
    } else {
        const post_result = await wsb_controller.gainLoss(interval);
        res.status(200).json(post_result);
    }
});

router.get('/index/:interval', async (req, res, next) => {
    const interval = req.params.interval;

    try {
        const result = await wsb_controller.historicalIndex(interval);
        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/index', async (req, res, next) => {
    const result = await wsb_controller.getIndex();

    res.status(200).json(result);
});

module.exports = router;