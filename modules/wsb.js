const { raw } = require('express');
const Snoowrap = require('snoowrap');
const config = require('../config');
const PostSchema = require('../models/post');
const StockSchema = require('../models/stock');
const mongoose = require('./dbhelper').mongoose;

const Post = mongoose.model('Post', PostSchema);
const Stock = mongoose.model('Stock', StockSchema);

const r = new Snoowrap({
    userAgent: config.wsb_userAgent,
    clientId: config.wsb_clientId,
    clientSecret: config.wsb_clientSecret,
    username: config.wsb_username,
    password: config.wsb_password
});

const wsb = r.getSubreddit('wallstreetbets');

function getSymbolsFromTitle(title = '', symbol_set = new Set()) {

    const symbol_output = new Set();
    const words = title.replace(/[^a-zA-Z]/g, " ").split(" ");
    words.forEach(word => {
        if (symbol_set.has(word)) {
            symbol_output.add(word);
        }
    });

    return Array.from(symbol_output);
}

async function getPostFromReddit(number_of_post) {

    return wsb.getNew({
        limit: number_of_post
    }).map(post => {
        return {
            id: post.id,
            flair: post.link_flair_text,
            title: post.title,
            content: post.selftext,
        }
    });
}

async function addPost() {

    let record_inserted = 0;
    const output = []

    const raw_posts = await getPostFromReddit(50);
    const symbol_dictionary = await Stock.getAllSymbolSet();

    for (const raw_post of raw_posts) {
        const { id, flair, title, content } = raw_post
        const symbolsFromPost = getSymbolsFromTitle(title, symbol_dictionary);

        for (const symbol of symbolsFromPost) {
            const newPost = new Post({
                post_id: id,
                title: title,
                flair: flair,
                body: content,
                symbol: symbol
            });
            const savedPost = await newPost.save();
            output.push({
                title: savedPost.title,
                symbol: savedPost.symbol
            });
        }
    }
    return output;
}

addPost().then(result => console.log(result))



