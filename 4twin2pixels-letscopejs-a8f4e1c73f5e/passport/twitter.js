var TwitterStrategy  = require('passport-twitter').Strategy;
var User = require('../models/user');
var twitterConfig = require('./social-app-config.js');

module.exports = function(passport) {

    passport.use('twitter', new TwitterStrategy({
        consumerKey     : twitterConfig.twitter.apikey,
        consumerSecret  : twitterConfig.twitter.apisecret,
        callbackURL     : twitterConfig.twitter.callbackURL

    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
	// User.findOne won't fire until we have all our data back from Twitter
    	process.nextTick(function() {
            console.log(profile._json);
	        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

	       	 	// if there is an error, stop everything and return that
		        // ie an error connecting to the database
	            if (err)
                {
	                return done(err);}

				// if the user is found then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	                // if there is no user, create them
                    var fname = "";
                    var lname = "";
                    var tags = [];
                    var name = profile.displayName.split(" ");
                    fname = name[0]; 
                    for (i = 2; i < name.length; i++) { 
                            lname += name[i] + " ";
                    }
                   /* for (i = 0; i < profile.status.entities.hashtags.length; i++) { 
                            tags.push(profile.status.entities.hashtags[i].text);
                    }*/
					// set all of the user data that we need
                    var newUser = new User({ 
                                            name : { fname: fname, lname: lname},
                                            username : profile.screen_name,
                                            about_me : profile.description,
                                            country : profile.location,
                                            profile_image_url : profile.profile_image_url,
	                                        potential_tags : tags,
                                            twitter: {
                                               id: profile.id,
	                                           token: token,
	                                           url: "https://www.twitter.com/"+profile.screen_name 
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

 
