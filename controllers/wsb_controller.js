const Index = require('../models/index');
const Post = require('../models/post');
const Stock = require('../models/stock');
const PostSymbol = require('../models/postsymbol');
const PastTimestamp = require('../modules/past_date');
const WSB = require('../modules/wsb');
const CommonWord = require('../modules/common_words');
const KPI = require('../modules/kpi');
const utility =  require('../modules/utility');


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

function gainLossSummary(current_posts, past_posts) {
    const current_posts_total = totalGainLossOfPost(current_posts);
    const previous_posts_total = totalGainLossOfPost(past_posts);

    const postSummary = {
        current_gain_loss_summary: current_posts_total,
        previous_gain_loss_summary: previous_posts_total,
        gain_post_growth_rate: KPI.growth_rate(current_posts_total.gain_total, previous_posts_total.gain_total),
        loss_post_growth_rate: KPI.growth_rate(current_posts_total.loss_total, previous_posts_total.loss_total),
        total_post_growth_rate: KPI.growth_rate(current_posts_total.index_total, previous_posts_total.index_total),
        volatility: 0,
    }

    return postSummary;
}

function generateStartEndDate(period, end_date = new Date(), pastBy = 1) {
    let numberOfDays = 0;
    let start_date;

    switch (period) {
        case 'day':
            numberOfDays = 1;
            break;

        case 'week':
            numberOfDays = 7
            break;

        case 'month':
            numberOfDays = 30;
            break;
    }

    start_date = PastTimestamp.PastDay(end_date, numberOfDays * pastBy);

    return {
        start_date: start_date,
        end_date: end_date,
    }

}

function generateCurrentPastDate(period = 'week', end_date = new Date(), pastBy = 1) {
    let current_end_date = end_date;
    let current_start_date;
    let previous_end_date;
    let previous_start_date;

    switch (period) {
        case 'day':
            current_start_date = PastTimestamp.PastDay(current_end_date);
            previous_end_date = PastTimestamp.PastDay(current_end_date, pastBy);
            previous_start_date = PastTimestamp.PastDay(current_start_date, pastBy);
            break;

        case 'week':
            current_start_date = PastTimestamp.PastWeek();
            previous_end_date = PastTimestamp.PastWeek(current_end_date, pastBy);
            previous_start_date = PastTimestamp.PastWeek(current_start_date, pastBy);
            break;

        case 'month':
            current_start_date = PastTimestamp.PastMonth();
            previous_end_date = PastTimestamp.PastMonth(current_end_date, pastBy);
            previous_start_date = PastTimestamp.PastMonth(current_start_date, pastBy);
            break
    }

    const dates = {
        current_end_date: current_end_date,
        current_start_date: current_start_date,
        previous_end_date: previous_end_date,
        previous_start_date: previous_start_date
    }

    return dates
}

async function gainLoss(summary_period = 'week') {
    const dates = generateCurrentPastDate(summary_period);
    const current_posts = await Post.findGainLossByDate(dates.current_start_date, dates.current_end_date);
    const past_posts = await Post.findGainLossByDate(dates.previous_start_date, dates.previous_end_date);
    const all_posts = current_posts.concat(past_posts);
    const summary = gainLossSummary(current_posts, past_posts);

    return {
        summary: summary,
        data_used: all_posts,
        dates: {
            start_date: dates.previous_start_date,
            end_date: dates.current_end_date
        }
    };
}

async function addPostAndPostSymbol(go_through = 100) {

    const addedPosts = []
    const postsFromReddit = await WSB.getPostFromReddit(go_through);
    const symbol_dictionary = await Stock.getSymbolSet();
    const filter_words = await CommonWord.mostCommonWords(200);
    const filter_dict = new Set(filter_words);

    for (const post of postsFromReddit) {
        const { id, flair, title, content } = post
        const symbolsFromPost = getSymbolsFromTitle(title, symbol_dictionary, filter_dict);
        const number_stock_symbol = symbolsFromPost.length

        const postExists = await Post.exists({ post_id: id });
        if (postExists || (flair !== 'Gain' && flair !== 'Loss' && number_stock_symbol === 0)) continue;

        const savedPost = await Post.createPost(id, flair, title, content);
        addedPosts.push(savedPost);

        for (const symbol of symbolsFromPost) {
            await PostSymbol.createPostSymbol(id, flair, symbol);
        }
    }

    return addedPosts;
}

async function topNStockSymbol(period, top = 5) {

    const { start_date, end_date } = generateStartEndDate(period);
    const topStocks = await PostSymbol.findTopNStocks(top, start_date, end_date);

    return {
        topStock: topStocks,
        dates: {
            start_date: start_date,
            end_date: end_date
        }
    };
}

function groupPostByDate(posts) {
    const painAversion = 2;
    const dateTracker = new Map();

    for (const post of posts) {
        const postDate = utility.trimTimeFromDate(post.date_created);

        if (!dateTracker.has(postDate)) {
            dateTracker.set(postDate, 0);
        }

        let currentPoints = dateTracker.get(postDate);
        currentPoints = post.flair === 'Gain' ? currentPoints + 1 : currentPoints - painAversion;
        dateTracker.set(postDate, currentPoints)
    }

    return dateTracker;
}

async function insertIndexes(dateTracker, dateStrings, startingIndex) {
    const insertedResult = [];
    let rollingIndex = startingIndex;

    for (const dateString of dateStrings) {
        const date = new Date(dateString);
        const dateExists = await Index.dateExists(date);
        rollingIndex = rollingIndex + dateTracker.get(dateString);

        if (dateExists === false) {
            const result = await Index.createIndex(rollingIndex, date);
            insertedResult.push(result);
        }
    }

    return insertedResult;
}

async function addIndex() {
    const lastRecord = await Index.findLastIndex();
    const last_date = lastRecord.date_created;
    const last_points =  lastRecord.points
    last_date.setDate(last_date.getDate() + 1);

    const posts = await Post.findGainLossByDate(last_date);
    const dateTracker = groupPostByDate(posts);
    
    const sortedDateStrings = Array.from(dateTracker.keys());
    sortedDateStrings.sort((a, b) => a - b);


    const recordsInserted = await insertIndexes(dateTracker, sortedDateStrings, last_points);
    return recordsInserted;
}

// Because all the date need to be in order for me to track index of previous date
// I am going to use a map to store individual index each day and then add value accumtatively once dates are sorted
async function initializeIndex() {

    await Index.deleteMany({});

    const posts = await Post.findAllGainLossPost();
    const dateTracker = groupPostByDate(posts);
    const sortedDateStrings = Array.from(dateTracker.keys());

    sortedDateStrings.sort((a, b) => a - b);

    const recordsInserted = await insertIndexes(dateTracker, sortedDateStrings, 0);
    return recordsInserted;
}



exports.addPostAndPostSymbol = addPostAndPostSymbol;
exports.gainLoss = gainLoss;
exports.topNStockSymbol = topNStockSymbol;
exports.initializeIndex = initializeIndex;
exports.addIndex = addIndex;
