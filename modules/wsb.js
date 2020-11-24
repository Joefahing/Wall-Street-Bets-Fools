const Snoowrap = require('snoowrap');
const config = require('../config');
const Post = require('../models/post');
const Stock = require('../models/stock');
const Stock_Post = require('../models/stock_post');
const common_word = require('./common_words');

const r = new Snoowrap({
    userAgent: config.wsb_userAgent,
    clientId: config.wsb_clientId,
    clientSecret: config.wsb_clientSecret,
    username: config.wsb_username,
    password: config.wsb_password
});

const wsb = r.getSubreddit('wallstreetbets');

function getSymbolsFromTitle(title = '', symbol_set = new Set(), filter_words = new Set()) {

    const symbol_output = new Set();
    const words = title.replace(/[^a-zA-Z]/g, " ").split(" ");
    words.forEach(word => {
        if (symbol_set.has(word) && !filter_words.has(word)) {
            symbol_output.add(word);
        }
    });

    return Array.from(symbol_output);
}

async function getPostFromReddit(number_of_post) {

    return wsb.getNew({
        limit: number_of_post,

    }).map(post => {
        return {
            id: post.id,
            flair: post.link_flair_text,
            title: post.title,
            content: post.selftext,
        }
    });
}

async function addPost(id, flair = '', title, content = '') {

    const newPost = new Post({
        post_id: id,
        title: title,
        flair: flair,
        body: content
    });

    return newPost.save();
}

async function addStock_Post(post_id, flair = '', symbol) {

    const newPost = new Stock_Post({
        post_id: post_id,
        flair: flair,
        symbol: symbol
    });

    return newPost.save();
}

async function addPostAndStockPost(go_through = 100) {

    const output = []
    const raw_posts = await getPostFromReddit(go_through);
    const symbol_dictionary = await Stock.getAllSymbolSet();
    const filter_word = await common_word.getTopMostCommonWords(200);
    const filter_word_set = new Set(filter_word);

    for (const raw_post of raw_posts) {
        const { id, flair, title, content } = raw_post
        const symbolsFromPost = getSymbolsFromTitle(title, symbol_dictionary, filter_word_set);

        const postExists = await Post.exists({ post_id: id });

        if (postExists || symbolsFromPost.length === 0) continue;

        const savedPost = await addPost(id, flair, title, content);
        output.push(savedPost);

        for (const symbol of symbolsFromPost) {
            await addStock_Post(id, flair, symbol);
        }
    }
    return output;
}

exports.addPostAndStockPost = addPostAndStockPost;

async function getAllGainLossPost(date_of_search = new Date(1970, 1, 1)) {
    try {
        const post_result = await Post.find()
            .where('flair').in(['Gain', 'Loss'])
            .where('date_created').gte(date_of_search)
            .select('title flair date_created').exec();
        return post_result.map(raw_result => {
            return {
                title: raw_result.title,
                flair: raw_result.flair,
                date_created: raw_result.date_created
            }
        });
    } catch (error) {
        console.log('Error occurred at getAllGainLossPost methods')
        throw error;
    }
}

exports.getAllGainLossPost = getAllGainLossPost;

async function getAllPostPastDate(date_of_search = new Date(1970, 1, 1)) {
    const post_result = await Stock_Post.find()
        .where('date_created').gte(date_of_search)
        .select('symbol flair date_created')
        .exec();
    return post_result;
}

exports.getAllPostPastDate = getAllPostPastDate;






