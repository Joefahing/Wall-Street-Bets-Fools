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

StockSchema.statics.getAllSymbolSet = async function () {
    const all_symbol_from_db = await this.find({}, 'symbol');
    const all_symbol = all_symbol_from_db.map(data => data.symbol);
    return new Set(all_symbol);
}

StockSchema.statics.updateVolumn = function (volumn = 0, symbol = '') {
    return this.updateOne({ symbol: symbol }, { volumn: volumn });
}

module.exports = StockSchema;



