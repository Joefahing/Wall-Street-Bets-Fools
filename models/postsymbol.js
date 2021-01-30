const mongoose = require('../modules/dbhelper').mongoose;
const Schema = mongoose.Schema;

const milliseconds = 1000;

const PostSymbol_Schema = new Schema({
    post_id: String,
    flair: String,
    symbol: String,
    date_created: Date
});

PostSymbol_Schema.statics.createPostSymbol = async function (post_id, flair = '', symbol, date_created_utc_seconds) {
    const newPostSymbol = await this.create({
        post_id: post_id,
        flair: flair,
        symbol: symbol,
        date_created: new Date(date_created_utc_seconds * milliseconds)
    });

    return newPostSymbol;
}

PostSymbol_Schema.statics.findTopNStocks = async function (top = 5, start_date, end_date) {
    const topStocks = await this.aggregate([
        {
            $match: {
                date_created: {
                    $gte: start_date,
                    $lt: end_date
                }
            }
        },
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


const PostSymbol = mongoose.model('PostSymbol', PostSymbol_Schema);
module.exports = PostSymbol;