var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name:{fname : String, lname: String},
    username: String,
    email: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    occupation : String,
    city: String,
    country: String,
    birthdate: Date,
    aboutme: String,
    myskills: String,
    gender: String,
    newsletter: Boolean,
    profileimageurl: String,
    potentialtags :[],
    followedtags:[{type: Schema.Types.ObjectId, ref: 'Tag'}],
    followingusers:[{type: Schema.Types.ObjectId, ref: 'User'}],
    website : String,
    fb: {
		id: String,
		access_token: String,
        url: String
    },
    twitter: {
        id: String,
		token: String,
		url: String
    },
    google: {
        id: String,
		token: String,
		url: String
    },
    pinterest: {
        url: String
    },
    instagram: {
        url: String
    },
    linkedin: {
        url: String
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);