const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'PRODUCTION') { require('dotenv').config(); }
const cron = require('./modules/cron');
const wsb_router = require('./routes/wsb_route');
const stock_router = require('./routes/stock_route');
const post_router = require('./routes/post_route');
//const test_router = require('./routes/test_route');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/stats', wsb_router);
app.use('/stock', stock_router);
app.use('/post', post_router);
//app.use('/test', test_router)
app.use(logError);
app.use(invalidBodyPropertiesHandler);
app.use(genericHandler);

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV === 'PRODUCTION') { cron.startJobs() };

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