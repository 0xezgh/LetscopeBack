var express = require('express');
var router = express.Router();


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('http://127.0.0.1/letscope/#/');
}

module.exports = function(passport){



	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/facebook', 
		passport.authenticate('facebook', { scope : 'email' }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : 'http://127.0.0.1/letscope/#/activity',
			failureRedirect : 'http://127.0.0.1/letscope/#/'
		})
	);
    
    // route for twitter authentication and login
	// different scopes while logging in
	router.get('/twitter', 
		passport.authenticate('twitter'));

	// handle the callback after facebook has authenticated the user
	router.get('/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : 'http://127.0.0.1/letscope/#/activity',
			failureRedirect : 'http://127.0.0.1/letscope/#/'
		})
	);
    
    // route for google authentication and login
	// different scopes while logging in
	router.get('/google', 
		passport.authenticate('google'));

	// handle the callback after google has authenticated the user
	router.get('/google/callback',
		passport.authenticate('google', {
			successRedirect : 'http://127.0.0.1/letscope/#/activity',
			failureRedirect : 'http://127.0.0.1/letscope/#/'
		})
	);
   

	return router;
}







/*"use strict";

var express = require('express');
var router = express.Router();
var passport = require('passport'); 
var Account = require('../models/account');
var Twitter = require("node-twitter-api");

var twitter = new Twitter({
        consumerKey: "TN5GOUDGR0PMX3C9cWsf7Ibpp",
        consumerSecret: "UiebqpngjdFW4pfN0lX3BD6j9SdMPDxVbpAcIkIB17JAEZvJTQ",
        callback: "http://127.0.0.1:3000/auth/twitter/callback"
    });

var _requestSecret;

router.get("/twitter", function(req, res, next) {
        twitter.getRequestToken(function(err, requestToken, requestSecret) {
            if (err)
                res.status(500).send(err);
            else {
                _requestSecret = requestSecret;
                res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
            }
        });
    });

router.get("/twitter/callback", function(req, res, next) {
        var requestToken = req.query.oauth_token;
        var verifier = req.query.oauth_verifier;
        
        twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
            if (err)
                res.status(500).send(err);
            else
                twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
                    if (err)
                        res.status(500).send(err);
                    else
                    {
                        console.log(user.status.entities.hashtags);
                        console.log(user);
                        
                            Account.register(
                                new Account({ 
                                    username : user.screen_name,
                                    name : {fname: user.name, lname: ""},
                                    twitter : {
                                        url : "https://www.twitter.com/"+user.screen_name,
                                        hashtags: user.status.entities.hashtags
                                    },
                                    about_me : user.description,
                                    country : user.location,
                                    profile_image_url : user.profile_image_url
                                    
                                }),                                 
                                user.screen_name, function(err, account) { 
                                     if (err) {    
                                          console.log("Erreur");
                                    } 
                        
                                res.redirect('http://localhost/letscope/#/activity');      
                                       
                                });

                    }
                });
        });
    });
  
module.exports = router; */