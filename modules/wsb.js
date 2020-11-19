const Snoowrap = require('snoowrap');
const stock_symbols = require('./symbols');
const config = require('../config');

class Post {
    constructor(id, flair, title, body = '', time_created, smybol) {
        this.id = id;
        this.flair = flair;
        this.title = title;
        this.body = body;
        this.created = new Date(time_created);
        this.symbol = symbol;
    }
}

const r = new Snoowrap({
    userAgent: config.wsb_userAgent,
    clientId: config.wsb_clientId,
    clientSecret: config.wsb_clientSecret,
    username: config.wsb_username,
    password: config.wsb_πpassword
});

const wsb = r.getSubreddit('wallstreetbets');

async function getTitleFromPost(title) {
    const symbols = await stock_symbols
    const set = new Set();

    symbols.forEach(stock_info => {
        set.add(stock_info.Symbol);
    })

    let t = 'For any NIO$a position holders'

    const processed_title = t.replace(/[^a-zA-Z]/g, " ")
}

//getTitleFromPost();

/*wsb.getNew({
    limit: 100
}).map(async post => {

    const all_symbols = await stock_symbols
    const set = new Set();

    all_symbols.forEach(stock_info => {
        set.add(stock_info.Symbol);
    });

    let title = post.title;
    const words = title.replace(/[^a-zA-Z]/g, " ").split(" ");
    const symbolsFromTitle = new Set();

    words.forEach(word => {
        if (set.has(word)) {
            symbolsFromTitle.add(word);
        }
    })

    return {
        id: post.id,
        flair: post.link_flair_text,
        title: post.title,
        // content: post.selftext,
        symbols: [...symbolsFromTitle],
        created_date: post.created,
    }
}).then(result => console.log(result))*/

