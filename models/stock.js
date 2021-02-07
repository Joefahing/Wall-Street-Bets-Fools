const mongoose = require('../modules/dbhelper').mongoose;
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    symbol: String,
    name: String,
    sector: String,
    volumn: { type: Number, default: 0 }
});

StockSchema.methods.isLowVolumn = function () {
    return this.volumn < 10000000
};

StockSchema.statics.getSymbolSet = async function () {
    const all_symbol_from_db = await this.find({}, 'symbol');
    const all_symbol = all_symbol_from_db.map(data => data.symbol);
    return new Set(all_symbol);
}

StockSchema.statics.symbolExists = async function (symbol = 'APPL') {
    const result = await this.exists({ 'symbol': symbol });
    return result;
}

StockSchema.statics.addSymbol = async function (symbol, name, volumn = 0, sector = '') {
    const newStock = await this.create({
        symbol,
        name,
        volumn,
        sector
    });

    return newStock;
}

StockSchema.statics.updateVolumn = function (volumn = 0, symbol = '') {
    return this.updateOne({ symbol: symbol }, { volumn: volumn });
}


module.exports = mongoose.model('Stock', StockSchema);



