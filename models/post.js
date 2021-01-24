const mongoose = require('../modules/dbhelper').mongoose;
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post_id: String,
    flair: String,
    title: String,
    body: String,
    date_created: { type: Date, default: new Date() },
});

PostSchema.statics.createPost = async function (id, flair = '', title, content = '') {

    const newPost = await this.create({
        post_id: id,
        title: title,
        flair: flair,
        body: content
    })

    return newPost
}

PostSchema.statics.findAllGainLossPost = async function () {
    try {
        const posts = await this.find()
            .where('flair').in(['Gain', 'Loss'])
            .exec();
        return posts.map(post => {
            return {
                title: post.title,
                flair: post.flair,
                post_id: '',
                date_created: post.date_created
            }
        });
    } catch (error) {
        console.log('Error occurred at getAllPost methods')
        throw error;
    }
}

PostSchema.statics.findGainLossByDate = async function (start_date = new Date('1970-01-01'), end_date = new Date()) {

    try {
        const posts = await this.find()
            .where('flair').in(['Gain', 'Loss'])
            .where('date_created').gte(start_date)
            .where('date_created').lt(end_date)
            .select('title flair date_created').exec();
        return posts.map(post => {
            return {
                title: post.title,
                flair: post.flair,
                post_id: '',
                date_created: post.date_created
            }
        });
    } catch (error) {
        console.log('Error occurred at findGainLossByDate methods')
        throw error;
    }
}

PostSchema.statics.numberOfGainLoss = function (posts) {

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

module.exports = mongoose.model('Post', PostSchema);