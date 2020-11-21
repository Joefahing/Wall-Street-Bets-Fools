const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    symbol: String,
    name: String,
    sector: { type: String, default: '' },
    volumn: { type: Number, default: 0 }
});

StockSchema.methods.isLowVolumn = function () {
    return this.volumn < 10000000
};

module.exports = StockSchema;



