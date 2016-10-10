var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var fbConfig = require('./social-app-config.js');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.fb.appID,
        clientSecret    : fbConfig.fb.appSecret,
        callbackURL     : fbConfig.fb.callbackUrl,
		profileFields: ['id', 'emails', 'first_name', 'last_name', 'gender', 'about', 'bio', 'birthday', 'location'
                        , 'website', 'likes'],
		scope: ['public_profile', 'email','gender']
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {

    	

		// asynchronous
		process.nextTick(function() {
            console.log(profile);
			// find the user in the database based on their facebook id
	        User.findOne({ 'fb.id' : profile.id }, function(err, user) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	                // if there is no user found with that facebook id, create them
					                    
					// set all of the facebook information in our user model
                    var newUser = new User({ 
                                            name : { 
                                                fname: profile.name.givenName, 
                                                lname: profile.name.familyName
                                            },
                                            /*username : profile.screen_name,
                                            about_me : profile.description,
                                            country : profile.location,
                                            profile_image_url : profile.profile_image_url,
	                                        potential_tags : tags,*/
                                            fb: {
                                               id: profile.id,
	                                           access_token: access_token,
	                                           url: "https://www.facebook.com/"+profile.id 
                                            }   
                                    
                                });
                    
					// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }

	        });
        });

    }));

};
