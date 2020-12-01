const mongoose = require('../modules/dbhelper').mongoose;

const Schema = mongoose.Schema;
const PostSymbol_Schema = new Schema({
    post_id: String,
    flair: String,
    symbol: String,
    date_created: { type: Date, default: new Date() }
});

PostSymbol_Schema.statics.createPostSymbol = async function (post_id, flair = '', symbol) {
    const newPostSymbol = await this.create({
        post_id: post_id,
        flair: flair,
        symbol: symbol
    });

    return newPostSymbol;
}

PostSymbol_Schema.statics.findTopNStocks = async function (top = 5) {
    const topStocks = await Stock_Post.aggregate([
        {
            $group: {
                _id: { symbol: '$symbol' },
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
    return topStocks;
}

PostSymbol_Schema.statics.findStockPostBySymbol = async function (symbol = 'AAPL') {
    const serialize_symbol = symbol.toUpperCase();

    const symbols = await this.find()
        .where({ 'symbol': serialize_symbol })
        .select('symbol flair date_created')
        .exec();
    return symbols;
}


const Stock_Post = mongoose.model('Stock_Post', PostSymbol_Schema);
module.exports = Stock_Post;