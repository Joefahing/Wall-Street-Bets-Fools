const mongoose = require('mongoose');
const { mongo_username, mongo_password } = require('../config');

mongoose.connect(`mongodb+srv://${mongo_username}:${mongo_password}@wsb.7qst6.mongodb.net/wsb?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true })

exports.mongoose = mongoose



