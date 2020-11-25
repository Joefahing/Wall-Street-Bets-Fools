const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER_ID}:${process.env.MONGO_PASSWORD}@wsb.7qst6.mongodb.net/wsb?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true });

exports.mongoose = mongoose



