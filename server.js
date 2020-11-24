const express = require('express');
const wsb_route = require('./routes/wsb_route');
const body_parser = require('body-parser');
const cron = require('./modules/cron');

const app = express();

app.use(body_parser.urlencoded({ extended: false }));
app.use('/stats', wsb_route);
app.use(logError);
app.use(invalidBodyPropertiesHandler);
app.use(genericHandler);

cron.startJobs();

app.listen(3000, () => {
    console.log('listening to port 3000')
});

function logError(error, req, res, next) {
    console.log(error);
    next(error);
}

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

function genericHandler(error, req, res, next) {
    res.status(500).json({
        message: `Undefine Error`
    });
}