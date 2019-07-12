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
    profileURL: String,
    current: String,
    start_time: Number,
    end_time: Number,
    average_time: Number,
    max_time: Number,
    token: String,
    times: Number
});

let userModel = mongoose.model('users', User);
exports.User = userModel;
