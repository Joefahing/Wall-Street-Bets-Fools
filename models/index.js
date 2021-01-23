const mongoose =  require('../modules/dbhelper').mongoose;
const Schema = mongoose.Schema;

const IndexSchema = new Schema({
    points: Number,
    date_created: {type: Date, default: new Date()}
});

IndexSchema.statics.createIndex = async function (currentIndex = 0){
    const newPoint =  await this.create({
        points: currentIndex
    });

    return newPoint;
}



module.exports = mongoose.model("Index", IndexSchema);