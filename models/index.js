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

IndexSchema.statics.findLastIndex = async function () {
    const lastRecord = await this.findOne()
        .sort({ date_created: -1 })
        .exec();
    return lastRecord;
}
IndexSchema.statics.findIndexByDate = async function (start_date, end_date) {
    const records = await this.find()
        .where('date_created').gte(start_date)
        .where('date_created').lte(end_date)
        .sort({ date_created: 1 })
        .select('points date_created')
        .exec()
    return records;
}

IndexSchema.statics.findIndexByTime = async function (date_created) {
    const record = await this.find()
        .where('date_created').eq(date_created)
        .exec()

    return record
}

IndexSchema.statics.dateExists = async function (date) {
    const record = await this.findOne({ date_created: date });
    return record !== null;
}



module.exports = mongoose.model("Index", IndexSchema);