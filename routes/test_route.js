const router = require('express').Router();
const ftp = require('../modules/ftp');

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

module.exports = router;