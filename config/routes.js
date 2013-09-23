//./config/routes.js

var User = require('../models/user.js'),
	Auth = require('./middlewares/authorization.js'),
	mailer = require('../libs/mailer.js'),
	Share = require('../libs/share.js'),
	nodemailer = require('nodemailer'),
	path = require('path'),
	templatesDir = path.resolve(__dirname, '..', 'views/mailer/templates'),
	emailTemplates = require('email-templates'),
	Collections = require('../libs/collections.js'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mixpanel = require('mixpanel'),
	mixpanel = Mixpanel.init('171f9debe2ee520bf0aa7c35455f5dba');

module.exports = function(app, passport) {
	
	/*
		Basic site functionality routes
	*/

	app.get('/collections', function(req, res) {
		var c = new Collections();
		c.getActiveCollections(function(sizes) {
			if(req.isAuthenticated()) {
				res.render('collections', {user: req.user, "data": sizes});
			} else {
				res.render('collections', {user: null, "data": sizes});
			}
			//res.render('collections', {"data": sizes});
		});
	});

	app.get('/collection/:collectionName', function(req, res) {
		var collection = req.params.collectionName;
		var c = new Collections();
		c.getCollection(collection, function(products) {
			res.render('collection', {
				"products": products,
				"collectionName": collection,
				user: req.user
			});
		});
	});

	app.get('/likes', function(req, res) {
		res.render('likes', {user: req.user});
	});

	app.post('/likeProduct', function(req, res) {
		var data = req.body;
		if(req.isAuthenticated()) {
			User.insertLike(req.user, {}, function() {
				console.log('hey');
			});
		}
		res.status(200).send();
	});

	app.get('/email', function(req, res) {
		res.render('email', {user: req.user});
	});

	app.post('/email', function(req, res) {
		var m = new mailer();
		m.email(req.body.emailAddress, function() {
			req.send(200);
		});
	});

	app.get('/feedback', function(req, res) {
		res.render('feedback', {user: req.user});
	});

	app.post('/feedback', function(req, res) {
		var m = new mailer();
			m.feedback(req.body.email, req.body.feedback, function() {
			res.send(200);
		})
	});

	app.post('/share', function(req, res) {
		var postData = req.body.data;
		var s = new Share();
		var base = "http://weaveuk.com/share/";
		s.new(postData.ownerEmail, postData.ownerName, postData.ownerGender, postData.ownerAge, postData.collectionName, postData.products, function(_id) {
			base += _id;
			res.send(base);
		});
	});

	app.get('/share/:shareId', function(req, res) {
		var shareId = req.params.shareId;
		var s = new Share();
		s.getShareDetails(shareId, function(result) {
			if(result == null) {
				res.send("No such share");
			}
			res.render('friend', {"results": result, user: req.user});
		});
	});

	app.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}));

	app.get("/auth/facebook/callback", 
		passport.authenticate("facebook",{ failureRedirect: '/login'}),
		function(req,res){
			//res.render("collections", {user : req.user});
			console.log('FB DETAILS');
			console.log(req.user);
			mixpanel.track("facebook login")
			mixpanel.people.set({
				$email: req.user.facebook.email,
				name: req.user.facebook.name
			});
			res.redirect('/collections');
		}
	);

	app.post('/friend/feedback', function(req, res) {
			var data = req.body.data;
			var s = new Share();
			s.getShareDetails(data._id, function(result) {

			emailTemplates(templatesDir, function(err, template) {
				if(err) {
					throw err;
				}
				var smtpTransport = nodemailer.createTransport("SMTP", {
					service: "Zoho", 
					auth: {
						user: "andy@weaveuk.com",
						pass: "weave2013"
					}
				});

				var locals = {
					email: result.ownerEmail,
					friend: data.friendName,
					name: result.ownerName,
					products: data.products,
					collection: result.collectionName,
					comment: data.comment
				};

				template('friend', locals, function(err, html) {
					if(err) {
						throw err;
					}
					smtpTransport.sendMail({
						from: "Weave Team <andy@weaveuk.com>",
						to: locals.email,
						bcc: 'Admin <nick@weaveuk.com>',
						subject: locals.friend + " has completed your Collection",
						html: html,
						generateTextFromHTML: true
					}, function(err, responseStatus) {
						if(err) {
							throw err;
						}
						res.status(200).send();

					})
				})
			})
		});
	});

	app.get('/skim', function(req, res) {
		res.render('skim');
	});


	/*

	Login / Logout routes 

	*/

	app.get('/', function(req, res) {
		if(req.isAuthenticated()) {
			res.render('index', {user: req.user});
		} else {
			res.render('index', {user: null});
		}
	});

	app.get("/login", function(req, res){ 
		res.render("login", {user: req.user});
	});

	app.post("/login", passport.authenticate('local',{
			successRedirect : "/collections",
			failureRedirect : "/login",
		})
	);

	app.get("/signup", function (req, res) {
		res.render("signup", {user: req.user});
	});

	app.post("/signup", Auth.userExist, function (req, res, next) {
		User.signup(req.body.name, req.body.email, req.body.password, function(err, user){
			if(err) throw err;
			req.login(user, function(err){
				if(err) return next(err);
				//return res.redirect("/collections");
				//res.status(200).send();
				//res.render('collections', {user: user, data: 0});
				res.status(200).send();
			});
		});
	});


	app.get("/profile", Auth.isAuthenticated , function(req, res){ 
		res.render("profile", { user : req.user});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});
}