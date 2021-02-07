const router = require('express').Router();
const ftp = require('../modules/ftp');
const wsb_controller = require('../controllers/wsb_controller');

router.get('/ftp', async (req, res, next) => {
    const host = 'ftp.nasdaqtrader.com';
    const file = '/SymbolDirectory/nasdaqlisted.txt';
    try {
        const stockListing = await ftp.fetchFromServer(host, file);
        res.send(stockListing);
    } catch (error) {
        res.status(400).json({
            message: 'error'
        })
    }
});

router.post('/index', async (req, res, next) => {
    try {
        const removeResult = await wsb_controller.removeIndex();
        const result = await wsb_controller.addIndex();
        res.send(result);

    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/index/:interval', async (req, res, next) => {
    const interval = req.params.interval;
    try {
        const result = await wsb_controller.historicalIndex(interval);
        res.send(result);

    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/index', async (req, res, next) => {
    const result = await wsb_controller.getIndex();
    console.log(result);
    res.send(result);
});

module.exports = router;