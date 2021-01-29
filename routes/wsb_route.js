const express = require('express');
const wsb_controller = require('../controllers/wsb_controller');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome fools, you ready to lose some money?'
    });
});

router.get('/gain_loss/post', async (req, res, next) => {
    const interval = req.query.interval;

    if (!interval) next({
        from: 'gain_loss/post',
    })
    else {
        const post_result = await wsb_controller.gainLoss(interval);
        res.status(200).json(post_result);
    }
});

router.get('/gain_loss/summary', async (req, res) => {
    const query_interval = req.query.interval;

    const summary = await wsb_controller.gainLoss(query_interval);
    res.status(200).json(summary);
});

router.get('/stock/top', async (req, res, next) => {

    const interval = req.query.interval;
    const topN = Number.parseInt(req.query.top);

    if (!req.query.interval || !topN) {
        next({
            from: 'stock/top'
        })
    }
    else {
        const interval = req.query.interval || 'week';
        const topN = Number.parseInt(req.query.top) || 5;

        const topStock = await wsb_controller.topNStockSymbol(interval, topN)
        res.json(topStock);
    }
});

router.get('/populate', async (req, res) => {
    const records = await wsb_controller. xIndex();
    console.log(records);
    res.send('done');
})

module.exports = router;
