const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/studify');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Mongo DB ON");
});
//TODO: 아이패드로 서버 스키마 그리기

let User = new mongoose.Schema({
    name: String,
    facebookId: String,
    start_time: String,
    end_time: String,
    average_time: String,
    max_time: String,
    token: String
});

let userModel = mongoose.model('userModel', User);
exports.User = userModel;
