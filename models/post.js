const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post_id: String,
    flair: String,
    title: String,
    body: String,
    symbol: String,
    created_date: { type: Date, default: Date.now() },
});

module.exports = PostSchema;