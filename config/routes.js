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
	Mixpanel = require('mixpanel'),
	mixpanel = Mixpanel.init('171f9debe2ee520bf0aa7c35455f5dba'),
	UserCollections = require('../libs/UserCollections.js'),
	APIMVP2 = require('../libs/APIMVP2.js'),
	Dashboard = require('../libs/Dashboard.js'),
	async = require('async');

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
			mixpanel.track("facebook login")
			mixpanel.people.set({
				$email: req.user.facgebook.email,
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
		res.render('landing');
		/*if(req.isAuthenticated()) {
			res.render('landing', {user: req.user});
		} else {
			res.render('', {user: null});
		}*/
	});

	app.get("/login", function(req, res){
		if(req.isAuthenticated()) {
			res.redirect('/collections');
		} else {
			res.render("login", {user: req.user});
		}
	});

	app.post("/login", passport.authenticate('local',{
			successRedirect : "/collections",
			failureRedirect : "/login",
		})
	);

	app.get("/signup", function (req, res) {
		if(req.isAuthenticated()) {
			res.redirect('/collections');
		} else {
			res.render("signup", {user: req.user});
		}
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

	/* Dashboard */
	app.get("/dashboard", function (req, res) {
		var dashboard = new Dashboard();
		dashboard.getData(function (response) {
			res.json(response[0]);
		})
		// How to render view with variables that jade can use
		//res.render("dashboard", { title : {title : "Test Title", value : 3}, product : data});
	})

	/* API */

	app.post("/api/get", function (req, res) {
		if(req.body.version != null) {
			console.log('Using new API');
			// need to use the new API
			var request = req.body,
				shops;
			console.log(request);
			if(request.shops != null) {
				shops = request.shops.split(',');
			}
			var c = new APIMVP2();
			c.run(request.UDID, shops, function(data) {
				res.json(data);
			})
		} else {
			var user = new UserCollections();
			user.userToSee(shops, request.UDID, function(result) {
			 	user.getCollections(result[0], shops, function(data) {
			 		if(result[0] != null)
			 			user.updateUserSeen(request.UDID, result[0]);
			 		var products = {
			 			"products": data
			 		}
			 		res.json(data);
			 	});
			});
		}
	});

	app.post('/api/get/all', function(req, res) {
		var a = new APIMVP2();
		a.all(req.body.UDID, function(result) {
			res.json(result);
		});
	});

	app.post('/api/email_brands', function(req, res) {
		console.log(req.body);



		emailTemplates(templatesDir, function (err, template) {
			if (err) throw err;

			var db = require('mongoskin').db("mongodb://weave:weave2013@paulo.mongohq.com:10028/weave-production_copy"),
				smtpTransport = nodemailer.createTransport("SMTP", {
					service: "Zoho", 
					auth: {
						user: "hello@weaveuk.com",
						pass: "weave2013"
					}
				}),
				products = [];

				console.log(products);
				console.log(req.body.urls);

			async.series([
				function (callback) {
					// console.log(products);
					async.forEach(req.body.urls, function (link, cb) {
						db.collection('products').find({url : link}).toArray(function (err, result) {
							products.push(result[0]);
							cb();
						});
					}, function (err) {
						if (err) return next(err);
						callback();
					});
				},
				function (callback) {
					// console.log("in the second function");
					// console.log(products);
					var locals = products

					// apparently local variables for template have to be called locals, products doesn't work?
					template('app', locals, function (err, html, text) {
						
						var mailOptions = {
							    from: "Weave Fashion <hello@weaveuk.com>", // sender address
							    to: req.body.email, // list of receivers
							    bcc: "hello@weaveuk.com",
							    subject: "Weave Fashion Finds", // Subject line
							    html: html, // html body
							    generateTextFromHTML: true
							};

						// console.log(mailOptions)


						if (err) throw err;

						smtpTransport.sendMail(mailOptions, function (error, responseStatus) {
							if (error) throw error;

							console.log(responseStatus.message);
						});
					});

					callback();
				},
			],
			function (err) {
				if (err) return next(err);
				console.log("finished")
			});			


			

		})



		// // send mail with defined transport object
		// smtpTransport.sendMail(mailOptions, function(error, response){
		//     if(error){
		//         console.log(error);
		//     } else {
		//         console.log("Message sent: " + response.message);
		//     }

		//     // if you don't want to use this transport object anymore, uncomment following line
		//     //smtpTransport.close(); // shut down the connection pool, no more messages
		// });

		// console.log(req.body.email);

		var j = {
			"status": "200"
		}
		res.json(j);
	});

	app.post('/api/facebook_user', function(req, res) {
		console.log(req.body);
	});
}
