var mongoose = require('mongoose');
var Schema = mongoose.Schema;



/*var Tag = new Schema({
    name: String,
	description : String,
	img: { data: Buffer, contentType: String }*/

var Tag = new Schema({
    name: String,
	description : String,

});
	
module.exports = mongoose.model('Tag', Tag);