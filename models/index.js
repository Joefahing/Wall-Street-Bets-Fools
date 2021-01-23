const mongoose = require('../modules/dbhelper').mongoose;
const Schema = mongoose.Schema;

const IndexSchema = new Schema({
    points: Number,
    date_created: Date
});

IndexSchema.statics.createIndex = async function (currentIndex = 0, date) {
    const newPoint = await this.create({
        points: currentIndex,
        date_created: date
    });

    return newPoint;
}

IndexSchema.statics.dateExists = async function (date) {
    const record = await this.findOne({ date_created: date });
    return record !== null;
}


module.exports = mongoose.model("Index", IndexSchema);