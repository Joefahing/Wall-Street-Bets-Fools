const mongoose = require('../modules/dbhelper').mongoose;
const Schema = mongoose.Schema;

const Stock_PostSchmea = new Schema({
    post_id: String,
    flair: String,
    symbol: String,
    date_created: { type: Date, default: new Date() }
});

const Stock_Post = mongoose.model('Stock_Post', Stock_PostSchmea);

module.exports = Stock_Post;