const Index = require('../models/index');
const Post = require('../models/post');
const Stock = require('../models/stock');
const PostSymbol = require('../models/postsymbol');
const PastTimestamp = require('../modules/past_date');
const Word = require('../models/word');
const wsb = require('../modules/wsb');
const CommonWord = require('../modules/common_words');
const KPI = require('../modules/kpi');
const utility = require('../modules/utility');


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
    let total = {
        gain_total: 0,
        loss_total: 0,
        get index_total() {
            return this.gain_total - this.loss_total;
        }
    }

    for (const post of posts) {
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

async function gainLoss(interval = 'week') {
    const dates = generateCurrentPastDate(interval);
    const current_posts = await Post.findGainLossByDate(dates.current_start_date, dates.current_end_date);
    const past_posts = await Post.findGainLossByDate(dates.previous_start_date, dates.previous_end_date);
    const all_posts = past_posts.concat(current_posts);
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

exports.historicalIndex = async function (interval = 'week') {
    const dates = generateCurrentPastDate(interval);
    const currentIndexes = await Index.findIndexByDate(dates.current_start_date, dates.current_end_date);
    const pastIndexes = await Index.findIndexByDate(dates.previous_start_date, dates.previous_end_date);
    const allIndexes = pastIndexes.concat(currentIndexes);

    return {
        data_used: allIndexes,
        dates: {
            start_date: dates.previous_start_date,
            end_date: dates.current_end_date
        }
    }
}

exports.getIndex = async function () {
    const baseDate = new Date(utility.trimTimeFromDate());
    const currentIndex = await Index.findLastIndex();
    const baseIndexes = await Index.findIndexByDate(baseDate, baseDate);
    const baseIndex = baseIndexes[0];
    
    return {
        current_index: currentIndex.points,
        current_date: currentIndex.date_created,
        base_index: baseIndex.points !== null ? baseIndex.points : 0,
        base_date: baseIndex.points !== null ? baseIndex.date_created : new Date(0)
    }
}

async function addPostAndPostSymbol(go_through = 100) {

    const addedPosts = []
    const postsFromReddit = await wsb.getPostFromReddit(go_through);
    const symbol_dictionary = await Stock.getSymbolSet();
    const filter_words = await CommonWord.mostCommonWords(200);
    const filter_dict = new Set(filter_words);

    for (const post of postsFromReddit) {
        const { id, flair, title, content, date_created } = post
        const symbolsFromPost = getSymbolsFromTitle(title, symbol_dictionary, filter_dict);
        const number_stock_symbol = symbolsFromPost.length

        const postExists = await Post.exists({ post_id: id });

        if (postExists || (flair !== 'Gain' && flair !== 'Loss' && number_stock_symbol === 0)) continue;

        const savedPost = await Post.createPost(id, flair, title, content, date_created);
        addedPosts.push(savedPost);

        for (const symbol of symbolsFromPost) {
            await PostSymbol.createPostSymbol(id, flair, symbol, date_created);
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

//Adding all the Gain and Loss post together down to hour
function groupPostByDate(posts) {
    const painAversion = 1;
    const dateTracker = new Map();

    for (const post of posts) {
        utility.addAditionalHour(post.date_created);
        const postDate = utility.trimMinuteFromDate(post.date_created);

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

    // console.log(dateTracker);
    // console.log(`dateStrings ${dateStrings}`);
    // console.log(`startingIndex ${startingIndex}`)

    if (dateStrings.length === 0) {
        const date = utility.trimMinuteFromDate(new Date());
        try {
            const result = await Index.createIndex(startingIndex, date);
            insertedResult.push(result);
        } catch (err) {
            throw err;
        }
    }
    else {
        for (const dateString of dateStrings) {
            const date = new Date(dateString);
            const dateExists = await Index.dateExists(date);
            rollingIndex = rollingIndex + dateTracker.get(dateString);

            if (!dateExists) {
                try {
                    const result = await Index.createIndex(rollingIndex, date);
                    insertedResult.push(result);
                } catch (err) {
                    throw err;
                }
            }
        }
    }

    return insertedResult;
}

async function addIndex() {
    const lastRecord = await Index.findLastIndex();
    const hasRecord = lastRecord !== null
    let last_date = new Date('1970-01-01');
    let last_points = 0;

    if (hasRecord) {
        last_date = lastRecord.date_created;
        last_points = lastRecord.points
        last_date.setMinutes(last_date.getMinutes() + 1);
    }

    const posts = await Post.findGainLossByDate(last_date);
    console.log(posts);
    const dateTracker = groupPostByDate(posts);
    const sortedDateStrings = Array.from(dateTracker.keys());
    sortedDateStrings.sort((a, b) => a - b);

    try {
        const recordsInserted = await insertIndexes(dateTracker, sortedDateStrings, last_points);

        console.log(`There should at least be one record inserted`);
        console.log(recordsInserted);

        return recordsInserted;
    } catch (err) {
        throw err
    }
}

async function removeIndex() {
    const result = await Index.deleteMany({});
    return result;
}

exports.removeInvalidStockPost = async function () {
    const filterWords = await Word.getAllWords();
    const deletedPost = await PostSymbol.deleteMany({})
        .where('symbol').in(filterWords);
    return deletedPost;
}

exports.addPostAndPostSymbol = addPostAndPostSymbol;
exports.gainLoss = gainLoss;
exports.topNStockSymbol = topNStockSymbol;
exports.addIndex = addIndex;
exports.removeIndex = removeIndex;
