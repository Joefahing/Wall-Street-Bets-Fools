const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'PRODUCTION') { require('dotenv').config(); }
const wsb_route = require('./routes/wsb_route');
const body_parser = require('body-parser');
const wsb_controller = require('./controllers/wsb_controller');
const cron = require('./modules/cron');

const app = express();

app.use(body_parser.urlencoded({ extended: false }));
app.use(cors());
app.use('/stats', wsb_route);
app.use(logError);
app.use(invalidBodyPropertiesHandler);
app.use(genericHandler);
cron.startJobs();

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send({
        message: 'WE ARE WATHCING YOU'
    });
});

app.post('/add', async (req, res) => {
    const addedPost = await wsb_controller.addPostAndPostSymbol(50);
    res.json(addedPost);
});


app.listen(PORT || 3000, () => {
    console.log(`Listening to port ${PORT}`);
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