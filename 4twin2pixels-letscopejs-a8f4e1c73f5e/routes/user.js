module.exports = function(io) {
    var User = require('../models/user');
    var express = require('express');
    var router = express.Router();

    var multer = require('multer');
    var fs = require('fs');
    var uuid = require('uuid');
    var v4 = uuid.v4();

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './images/profile')
        },
        filename: function (req, file, cb) {

            cb(null, v4 + '.jpg')
        }
    });
    var upload = multer({storage: storage});

    router.post('/upload/:id', upload.single('file'), function (req, res, next) {
        User.findByIdAndUpdate(req.params.id, {$set: {profileimageurl: v4}}, {new: true}, function (err, user) {
            console.log('Done');
            if (err) res.json({err: err});
        });
        res.json({info: 'Successfully uploaded!'});
    });

    router.get('/download', function (req, res) {
        var file = './images/default.jpg';
        fs.stat(file, function (err, stat) {
            var img = fs.readFileSync(file);
            res.contentType = 'image/jpg';
            res.contentLength = stat.size;
            res.end(img, 'binary');
        });
    });

    router.get('/download/:file', function (req, res) {
        var filePath = './images/profile/' + req.params.file + '.jpg';
        fs.exists(filePath, function (exists) {
            if (!exists) {
                var file = './images/default.jpg';
                fs.stat(file, function (err, stat) {
                    var img = fs.readFileSync(file);
                    res.contentType = 'image/jpg';
                    res.contentLength = stat.size;
                    res.end(img, 'binary');
                });
            }
            else {
                fs.stat(filePath, function (err, stat) {
                    var img = fs.readFileSync(filePath);
                    res.contentType = 'image/jpg';
                    res.contentLength = stat.size;
                    res.end(img, 'binary');
                });
            }
        });
    });

    router.get('/:id', function (req, res, next) {
        User.findById(req.params.id).exec(function (err, user) {
            if (err) res.json({error: err});
            res.json(user);
        });
    });

    router.put('/:id', function (req, res, next) {
        console.log(req.body);
        User.findByIdAndUpdate(req.params.id, {
            name: {fname: req.body.fname, lname: req.body.lname},
            occupation: req.body.occupation,
            website: req.body.website,
            country: req.body.country,
            city: req.body.city,
            aboutme: req.body.aboutme,
            myskills: req.body.myskills,
            fb: {url: req.body.facebook},
            twitter: {url: req.body.twitter},
            google: {url: req.body.google},
            pinterest: {url: req.body.pinterest},
            instagram: {url: req.body.instagram},
            linkedin: {url: req.body.linkedin}
        }, {new: true}, function (err, user) {
            if (err) res.json({error: err});
            res.json(user);
        });
    });

    router.put('/:id/:followed', function (req, res, next) {
        User.findByIdAndUpdate(req.params.id, {
            $push: {followedusers: req.params.followed}
        }, {safe: true, upsert: true}, function (err, user) {
            if (err) res.json({error: err});
            res.json(user);
        });
        io.emit('notification', 'Notification ' + new Date().toDateString());
    });

    return router;

}

