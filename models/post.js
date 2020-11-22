const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post_id: String,
    flair: String,
    title: String,
    body: String,
    date_created: { type: Date, default: new Date() },
});

module.exports = PostSchema;