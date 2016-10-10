var User = require('../models/user');
var passport = require('passport');
var express = require('express');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var router = express.Router();

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!',
                id: user._id,
                name: user.name.fname
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.post('/register', function(req, res) {
    User.register(new User({
        name: {fname: req.body.fname, lname: req.body.lname},
        username: req.body.username,
        email: req.body.email,
        country: req.body.country,
        city: "",
        occupation: "",
        birthdate: new Date(req.body.birthdate),
        aboutme: "",
        myskills: "",
        gender: "",
        potentialtags :[],
        website : "",
        newsletter: req.body.newsletter,
        fb: {
            id: "",
            access_token: "",
            url: ""
        },
        twitter: {
            id: "",
            token: "",
            url: ""
        },
        google: {
            id: "",
            token: "",
            url: ""
        },
        pinterest: {
            url: ""
        },
        instagram: {
            url: ""
        },
        linkedin: {
            url: ""
        }
    }), req.body.password, function(err, user) {
        if (err) {
            return res.json({error: err});
        }
        passport.authenticate('local')(req, res, function () {
            res.json(user);
        });
    });
});

router.post('/forget', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    return res.json({error: 'No account with that email address exists.'});
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport('smtps://letscope.network%40gmail.com:Azertyui123@smtp.gmail.com');
            var mailOptions = {
                to: user.email,
                from: 'letscope.network@gmail.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://localhost/letscope/#/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                if (err){
                    return res.json({error: 'An error has occurred while sending the e-mail : ' + err});
                }
                return res.json({info: 'An e-mail has been sent to ' + user.email + ' with further instructions.'});
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err)
            return res.json({error: 'Error while sending the e-mail !'});

    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    return res.json({error : "Password reset token is invalid or has expired."});
                }

                user.setPassword(req.body.password,function(err,user){
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport('smtps://letscope.network%40gmail.com:Azertyui123@smtp.gmail.com');
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                return res.json({info: 'An e-mail has been sent to ' + user.email + ' with further instructions.'});
                done(err);
            });
        }
    ], function(err) {
        res.json({error : err});
    });
});

module.exports = router;