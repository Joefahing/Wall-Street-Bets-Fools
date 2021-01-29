const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'PRODUCTION') { require('dotenv').config(); }
const body_parser = require('body-parser');
const cron = require('./modules/cron');
const wsb_route = require('./routes/wsb_route');
const stock_route = require('./routes/stock_route');

const app = express();

app.use(body_parser.urlencoded({ extended: false }));
app.use(cors());
app.use('/stats', wsb_route);
app.use('/stock', stock_route);
app.use(logError);
app.use(invalidBodyPropertiesHandler);
app.use(genericHandler);
//Cron job is removed temperarly
//cron.startJobs();

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send({
        message: 'WE ARE WATHCING YOU'
    });
});

app.listen(PORT || 3000, () => {
    console.log(`Listening to port ${PORT}`);
});

function logError(error, req, res, next) {
    next(error);
}

function invalidBodyPropertiesHandler(error, req, res, next) {
    if (error.error_type === 'invalid param') {
        res.status(400).json({
            message: `Invalid Parameter`
        });
    }
    else {
        next(error);
    }
}

function genericHandler(error, req, res, next) {
    res.status(500).json({
        message: `Undefine Error`
    });
}

module.exports = app;