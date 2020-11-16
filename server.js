const express = require('express');
const Snoowrap = require('snoowrap');
const config = require('./config');
const symbols = require('./symbols');

const app = express();

const r = new Snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    username: config.username,
    password: config.password
});

const wsb = r.getSubreddit('wallstreetbets');

app.get('/', (req, res) => {
    res.send('Wall Street Bets Data I am coming');
});

app.get('/wsb', (req, res) => {
    wsb.getNew({
        limit: 100
    }).map(post => {
        return {
            id: post.id,
            flair: post.link_flair_text,
            title: post.title,
            content: post.selftext,
            created_date: post.created,
        }
    })
        .then((post) => {
            res.send(post);
        });
});

app.get('/symbols', (req, res) => {
    symbols.then(result => res.send(result));
})

app.listen(3000, () => {
    console.log('listening to port 3000')
});

