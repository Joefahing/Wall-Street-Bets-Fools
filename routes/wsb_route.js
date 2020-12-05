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
    const time_interval = req.query.interval;

    const summary = await wsb_controller.gainLoss(time_interval);
    res.status(200).json(summary);
});

// router.get('/stock/top', async (req, res) => {
//     const result = await wsb.getTopNStocks();
//     res.json({
//         top_stock: result
//     });
// });

module.exports = router;
