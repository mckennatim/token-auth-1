var db = require('../cfg').db();
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var usersSchema = new Schema({
	name: {type:String, index:{unique: true}},
	email: String,
	apikey: String,
	lists: Array,
	timestamp: String,
	role: String
}, { strict: false });
mongoose.connect(db.url);


module.exports = mongoose.model('User', usersSchema);
