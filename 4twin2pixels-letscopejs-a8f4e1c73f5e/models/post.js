var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
	id : String,
	title : String,
	
	description : {
		longDesc : String ,
		shortDesc : String 
	},
	imgContent : String,
	tag:[{type: Schema.Types.ObjectId, ref: 'Tag'}],

	likes : [String],
	view : String ,

	comments :
	{
		id : String ,
		comment : String ,
		user : String
	},
	work_status : String,
	user : String,
	date :  { type: Date, default: Date.now }
})

module.exports = mongoose.model('Post', Post);