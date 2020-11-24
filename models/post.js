const mongoose = require('../modules/dbhelper').mongoose;
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post_id: String,
    flair: String,
    title: String,
    body: String,
    date_created: { type: Date, default: new Date() },
});

async function addPost(id, flair = '', title, content = '') {

    const newPost = new Post({
        post_id: id,
        title: title,
        flair: flair,
        body: content
    });

    return newPost.save();
}


module.exports = mongoose.model('Post', PostSchema);