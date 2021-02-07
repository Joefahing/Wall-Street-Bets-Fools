const mongoose = require('../modules/dbhelper').mongoose;
const Schema = mongoose.Schema;

const WordSchema = new Schema({
    word: String,
    date_created: { type: Date, default: new Date() }
});

WordSchema.statics.addWords = async function (words = []) {
    const result = await this.insertMany(words);

    return result;
}

WordSchema.statics.getAllWords = async function () {
    const queryResult = await this.find();
    const words = queryResult.map((result) => {
        return result.word
    });

    return words;
}

WordSchema.statics.getWordSet = async function () {
    const queryResult = await this.find();
    const words = queryResult.map((result) => {
        return result.word
    });
    const wordDict = new Set(words);

    return wordDict;
}



module.exports = mongoose.model('Word', WordSchema);