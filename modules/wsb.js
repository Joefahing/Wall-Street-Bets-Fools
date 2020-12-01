const Snoowrap = require('snoowrap');
const Post = require('../models/post');
const Stock = require('../models/stock');
const PostSymbol = require('../models/stock_post');
const common_word = require('./common_words');
const PastTimestamp = require('./past_date');

const r = new Snoowrap({
    userAgent: process.env.WSB_USER_AGENT,
    clientId: process.env.WSB_CLIENT_ID,
    clientSecret: process.env.WSB_CLIENT_SECRET,
    username: process.env.REDDIT_USER_ID,
    password: process.env.REDDIT_PASSWORD
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

    const newPost = new PostSymbol({
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
        const number_stock_symbol = symbolsFromPost.length

        const postExists = await Post.exists({ post_id: id });

        if (postExists) continue;
        if (flair !== 'Gain' && flair !== 'Loss' && number_stock_symbol === 0) continue;

        const savedPost = await addPost(id, flair, title, content);
        output.push(savedPost);

        for (const symbol of symbolsFromPost) {
            await addStock_Post(id, flair, symbol);
        }
    }
    return output;
}


async function getAllGainLossPost(start_date = new Date('1970-01-01'), end_date = new Date()) {

    try {
        const post_result = await Post.find()
            .where('flair').in(['Gain', 'Loss'])
            .where('date_created').gte(start_date)
            .where('date_created').lt(end_date)
            .select('title flair date_created').exec();
        return post_result.map(raw_result => {
            return {
                title: raw_result.title,
                flair: raw_result.flair,
                post_id: '',
                date_created: raw_result.date_created
            }
        });
    } catch (error) {
        console.log('Error occurred at getAllGainLossPost methods')
        throw error;
    }
}

function totalGainLossOfPost(posts) {
    const total = {
        gain_total: 0,
        loss_total: 0,
        get index_total() {
            return this.gain_total - this.loss_total;
        }
    }

    for (post of posts) {
        if (post.flair === 'Gain') total.gain_total++;
        else total.loss_total++;
    }

    return total;
}


async function getGainLossSummary(summary_period = 'week') {
    let current_interval_end_date = new Date();
    let current_interval_start_date;
    let previous_interval_end_date;
    let previous_interval_start_date;
    const pastBy = 1;

    switch (summary_period) {
        case 'day':
            current_interval_start_date = PastTimestamp.PastDay();
            previous_interval_end_date = PastTimestamp.PastDay(current_interval_end_date, pastBy);
            previous_interval_start_date = PastTimestamp.PastDay(current_interval_start_date, pastBy);
            break;

        case 'week':
            current_interval_start_date = PastTimestamp.PastWeek();
            previous_interval_end_date = PastTimestamp.PastWeek(current_interval_end_date, pastBy);
            previous_interval_start_date = PastTimestamp.PastWeek(current_interval_start_date, pastBy);
            break;

        case 'month':
            current_interval_start_date = PastTimestamp.PastMonth();
            previous_interval_end_date = PastTimestamp.PastMonth(current_interval_end_date, pastBy);
            previous_interval_start_date = PastTimestamp.PastMonth(current_interval_start_date, pastBy);
            break
    }

    const current_interval_posts = await getAllGainLossPost(current_interval_start_date, current_interval_end_date);
    const previous_interval_posts = await getAllGainLossPost(previous_interval_start_date, previous_interval_end_date);

    const current_posts_total = totalGainLossOfPost(current_interval_posts);
    const previous_posts_total = totalGainLossOfPost(previous_interval_posts);

    const postSummary = {
        current_gain_loss_summary: current_posts_total,
        previous_gain_loss_summary: previous_posts_total,
        gain_post_growth_rate: growth_rate(current_posts_total.gain_total, previous_posts_total.gain_total),
        loss_post_growth_rate: growth_rate(current_posts_total.loss_total, previous_posts_total.loss_total),
        total_post_growth_rate: growth_rate(current_posts_total.index_total, previous_posts_total.index_total),
        volatility: 0,
    }

    return postSummary;
}

function growth_rate(current_value, last_value) {
    if (isNaN(current_value) || isNaN(last_value) || last_value === 0) return 0;

    const growth_rate = ((current_value - last_value) / last_value);

    return Number.parseFloat(growth_rate.toFixed(2));
}

async function getTopNStocks(top = 5) {
    const query_result = await PostSymbol.aggregate([
        {
            $group: {
                _id: {
                    symbol: '$symbol'
                },
                noise: { $sum: 1 }
            },
        },
        { $sort: { noise: -1 } },
        { $limit: top },
        {
            $project: {
                _id: 0,
                symbol: '$_id.symbol',
                noise: '$noise',
            }
        }
    ]).exec();

    return query_result;
}


async function getAllPostPastDate(date_of_search = new Date(1970, 1, 1)) {
    const post_result = await PostSymbol.find()
        .where('date_created').gte(date_of_search)
        .select('symbol flair date_created')
        .exec();
    return post_result;
}

async function deleteStockPostBySymbol(symbol) {
    const post_deleted = await PostSymbol.deleteMany({ "symbol": symbol });
    return post_deleted;
}

exports.addPostAndStockPost = addPostAndStockPost;
exports.getAllGainLossPost = getAllGainLossPost;
exports.getGainLossSummary = getGainLossSummary;
exports.getAllPostPastDate = getAllPostPastDate;
exports.getTopNStocks = getTopNStocks;
exports.deleteStockPostBySymbol = deleteStockPostBySymbol;






