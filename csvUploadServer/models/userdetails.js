var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    place: { type: String, require: true },
    latitude: { type: String, require: true },
    longitude: { type: String, require: true }
});

module.exports = mongoose.model("Userdetails", schema);