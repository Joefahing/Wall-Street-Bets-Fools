const Snoowrap = require('snoowrap');
const Post = require('../models/post');
const Stock = require('../models/stock');
const PostSymbol = require('../models/postsymbol');
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

exports.getPostFromReddit = getPostFromReddit;





