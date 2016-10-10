var post = require('../models/post');
var express = require('express');
var router = express.Router();

var multer = require('multer');
var fs = require('fs');
var uuid = require('uuid');
var v4 = uuid.v4();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/posts')
    },
    filename: function (req, file, cb) {

        cb(null, v4 + '.jpg')
    }
});
var upload = multer({storage: storage});

router.get('/posts/:idTag', function(req, res, next) {
    var resposts=[];
    var id=req.params.idTag;
    post.find({}).exec(function(err, posts){
        if (err) res.json({error: err});

        for (var i=0;i<posts.length;i++){
            var p=posts[i];
            console.log(p.tag.length+'       -       ');
            for (var j=0;j<p.tag.length;j++){

                console.log("for number 2");
                console.log(p);

                if (p.tag[j]==id) {
                    resposts.push(p);
                    break;
                }}
        }
        res.json(resposts);
        console.log(resposts);
        resposts=[];
    });
});

router.post('/upload/:id', upload.single('file'), function (req, res, next) {
    post.findByIdAndUpdate(req.params.id, {$set: {imgContent: v4}}, {new: true}, function (err, user) {
        console.log('Done');
        if (err) res.json({err: err});
    });
    res.json({info: 'Successfully uploaded!'});
});

router.get('/download', function (req, res) {
    var file = './images/default-post.jpg';
    fs.stat(file, function (err, stat) {
        var img = fs.readFileSync(file);
        res.contentType = 'image/jpg';
        res.contentLength = stat.size;
        res.end(img, 'binary');
    });
});

router.get('/download/:file', function (req, res) {
    var filePath = './images/posts/' + req.params.file + '.jpg';
    fs.exists(filePath, function (exists) {
        if (!exists) {
            var file = './images/default-post.jpg';
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

router.post('/', function(req, res, next) {
	var p = new post({
				title: req.body.title,
				description: {longDesc: req.body.longDesc, shortDesc: req.body.shortDesc},
				tag: req.body.tag,
				imgContent: '',
				work_status: req.body.work_status,
				})
	.save(function(err, post){
		if (err) {
            return res.json({error: err});
        }
	console.log(post);
	res.json(post);
	});
});

router.get('/:id', function(req, res, next) {
    post.findById(req.params.id).exec(function(err, post){
        if (err) res.json({error: err});
        res.json(post);
    });
});

router.get('/', function(req, res, next) {
    post.find().exec(function(err, cats){
        if (err) res.json({error: err});
		res.json(cats);

    });

});

router.get('/status/:work_status', function(req, res, next) {
    post.find({ 'work_status': req.params.work_status }).exec(function(err, cats){
        if (err) res.json({error: err});
		res.json(cats);

    });
});

router.get('/', function(req, res, next) {
			post.find().exec(function(err, cats){
				if (err) res.json({error: err});
				res.json(cats);
			});
		});

router.put('/:id', function(req, res, next) {
    console.log(req.body);
    post.findByIdAndUpdate(req.params.id,{
                                    title: req.body.title,
									shortDesc: req.body.shortDesc
                                            },{new: true},function(err, post){
        if (err) res.json({error: err});
        res.json(post);
    });
});

module.exports = router;