const express = require('express');
const utility = require('../modules/utility');
const router = express.Router();
const wsb_controller = require('../controllers/wsb_controller');


router.get('/rank/:interval/:count', async (req, res, next) => {
    const interval = req.params.interval;
    const count = parseInt(req.params.count);

    if (!utility.isInterval(interval) || !Number.isInteger(count)) {
        next({
            error_type: 'invalid param'
        })
    }
    else {
        const topStock = await wsb_controller.topNStockSymbol(interval, count);
        res.json(topStock);
        res.status(200).json(topStock);
    }
});

module.exports = router;