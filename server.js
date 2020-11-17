const express = require('express');
const symbols = require('./symbols');

const app = express();

const wsb = r.getSubreddit('wallstreetbets');

app.get('/', (req, res) => {
    res.send('Wall Street Bets Data I am coming');
});

app.get('/wsb', (req, res) => {
    res.send('welcome fools');
});

app.get('/symbols', (req, res) => {
    symbols.then(result => res.send(result));
})

app.listen(3000, () => {
    console.log('listening to port 3000')
});

