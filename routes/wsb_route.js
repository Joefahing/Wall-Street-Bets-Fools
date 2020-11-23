const express = require('express');
const wsb = require('../modules/wsb');
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

router.get('/gain_loss', async (req, res) => {
    const gainLossPost = await wsb.getAllGainLossPost();
    res.status(200).json(gainLossPost)
});

router.post('/add_post', async (req, res, next) => {
    if (!req.body.search || Number.isInteger(parseInt(req.body.search))) {
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