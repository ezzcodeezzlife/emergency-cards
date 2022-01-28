const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    passcode: String,
    uid: String,
    name: String,
    sex: String,
    borndate: String,
    address: String,
    number: String,
    enumber: String,
    bloodtype: String,
    extratext: String,
    previousillness: [String],
    bloodtype: String,

});
module.exports = mongoose.model('dbEntry', entrySchema);

