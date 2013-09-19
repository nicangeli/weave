//./config/routes.js

var User = require('../models/user.js'),
	Auth = require('./middlewares/authorization.js'),
	mailer = require('../libs/mailer.js'),
	Share = require('../libs/share.js'),
	nodemailer = require('nodemailer'),
	path = require('path'),
	templatesDir = path.resolve(__dirname, '..', 'views/mailer/templates'),
	emailTemplates = require('email-templates'),
	Collections = require('../libs/collections.js');

module.exports = function(app, passport) {
	
	/*
		Basic site functionality routes
	*/

	app.get('/collections', function(req, res) {
		var c = new Collections();
		c.getActiveCollections(function(sizes) {
			res.render('collections', {"data": sizes});
		});
	});

	app.get('/collection/:collectionName', function(req, res) {
		var collection = req.params.collectionName;
		var c = new Collections();
		c.getCollection(collection, function(products) {
			res.render('collection', {
				"products": products,
				"collectionName": collection
			});
		});
	});

	app.get('/likes', function(req, res) {
		res.render('likes');
	});

	app.get('/email', function(req, res) {
		res.render('email');
	});

	app.post('/email', function(req, res) {
		var m = new mailer();
		m.email(req.body.emailAddress, function() {
			req.send(200);
		});
	});

	app.get('/feedback', function(req, res) {
		res.render('feedback');
	});

	//app.post('/feedback', routes.feedbackSend);

	//app.post('/share', routes.share);
	//app.get('/share/:shareId', routes.enterViaShare);
	//app.post('/friend/feedback', routes.feedbackReturned);

	app.get('/skim', function(req, res) {
		res.render('skim');
	});


	/*

	Login / Logout routes 

	*/

	app.get('/', function(req, res) {
		console.log(req.user);
		if(req.isAuthenticated()) {
			res.render('index', {user: req.user});
		} else {
			res.render('index', {user: null});
		}
	});

	app.get("/login", function(req, res){ 
		res.render("login");
	});

	app.post("/login", passport.authenticate('local',{
			successRedirect : "/collections",
			failureRedirect : "/login",
		})
	);

	app.get("/signup", function (req, res) {
		res.render("signup");
	});

	app.post("/signup", Auth.userExist, function (req, res, next) {
		User.signup(req.body.email, req.body.password, function(err, user){
			if(err) throw err;
			req.login(user, function(err){
				if(err) return next(err);
				return res.redirect("profile");
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