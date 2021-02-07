/*
const router = require('express').Router();
const ftp = require('../modules/ftp');
const wsb_controller = require('../controllers/wsb_controller');
const ftp_controller = require('../controllers/ftp_controller');
const wsb = require('../modules/wsb');

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

router.get('/ftp/controller', async (req, res, next) => {

    try {
        const result = await ftp_controller.addIndex();
        console.log(`${result.length} new symbols added`);
        res.send('Running ftp addindex');
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

router.get('/stock/remove', async (req, res) => {
    const result = await ftp_controller.removeInvalidSymbols();
    console.log(result)
    res.send(result);
})

router.get('/stockpost/remove', async (req, res) => {
    const result = await wsb_controller.removeInvalidStockPost();
    console.log(result)
    res.send(result);
})

module.exports = router;

*/