var Tag = require('../models/tag');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var imgPath = 'C:/Users/mohamedezzedine/Desktop/gardening.png';


/*router.post('/', function(req, res, next) {
	console.log(req.body.name);
	console.log(req.body.description);
	var t = new Tag({
				name: req.body.name,
				description: req.body.description,
				
				})
				t.img.data = fs.readFileSync(imgPath);
	t.img.contentType = 'png';
	t.save(function(err, tag){
	console.log(tag);
	res.redirect('#/activity');
	});
});*/



router.post('/', function(req, res, next) {
	console.log(req.body.name);
	console.log(req.body.description);
	var t = new Tag({
				name: req.body.name,
				description: req.body.description,
				
				})
.save(function(err, tag){
	console.log(tag);
	res.redirect('#/activity');
	});
});



router.get('/', function(req, res, next) {
    Tag.find().exec(function(err, cats){
        if (err) res.json({error: err});
		res.json(cats);
    });
});


router.get('/:name', function(req, res, next) {
console.log("Get tag by name function");
    Tag.findOne({name: req.params.name}).exec(function(err, tag){
        if (err) res.json({error: err});
		res.json(tag);
    });
});


router.delete('/:name', function(req, res) {

    Tag.remove({ name: req.params.name }, function(err) {
        if (!err) {
            return res.send('Tag deleted!');
        } else {
            return res.send('Error deleting tag!');
        }
    });

});


/*router.delete( function (req, res) {     
        Tag.remove({
            name: req.params.name
        }, function (err, user) {
            if (err) return res.send(err);
            res.json({ message: 'Deleted' });
        });
    });*/

	
/*router.delete('/:name', function(req, res, next) {
console.log("suppresion of a tag");
    Tag.delete({name: req.params.name}).exec(function(err, msg){
        if (err) res.json({error: err});
		return res.json({msg: 'Done'});
    });
});*/	
	
/*router.delete('/:name', function(req, res, next) {
    Tag.delete(req.params.name,function(err){
        if (err) res.json({error: err});
        return res.json({msg: 'Done'});
    });
});*/

module.exports = router;

/*router.post('/register', function(req, res) {
    User.register(new User({
        name: {fname: req.body.fname, lname: req.body.lname},
        username: req.body.username,
        country: req.body.country,
        birth_date: new Date(req.body.birthdate),
        newsletter: req.body.newsletter
    }), req.body.password, function(err, user) {
        if (err) {
            return res.json({error: 'error'});
        }
        passport.authenticate('local')(req, res, function () {
            res.json(user);
        });
    });
});

/*
router.get('/', function(req, res, next) {
    user.find().exec(function(err, cats){
        if (err) res.json({error: err});
        res.json(cats);
    });
});

router.get('/:username', function(req, res, next) {
    User.findOne({username: req.params.username}).exec(function(err, user){
        if (err) res.json({error: err});
        res.json(user);
    });
});
/*
router.put('/:id', function(req, res, next) {
    user.findByIdAndUpdate(req.params.id,{name: req.body.name},{new: true},function(err, cat){
        if (err) res.json({error: err});
        res.json(cat);
    });
});

router.delete('/:id', function(req, res, next) {
    user.findByIdAndRemove(req.params.id,function(err){
        if (err) res.json({error: err});
        return res.json({msg: 'Done'});
    });
});
 */


