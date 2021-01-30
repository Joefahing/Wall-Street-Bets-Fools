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

router.get('/test', async (req, res) => {
    // await wsb_controller.removeIndex();
    // const result = await wsb_controller.addIndex();
    // res.json(result);
    const result = await wsb_controller.redditPost();
    res.send({
        count: result.length,
        result: result
    });
});

module.exports = router;