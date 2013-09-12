
/*
 * GET home page.
 */

var femaleCollection1 = require('../collections/female/first.js').data,
	femaleCollection2 = require('../collections/female/second.js').data,
	maleCollection1 = require('../collections/male/first.js').data,
	maleCollection2 = require('../collections/male/second.js').data,
	winterCollection1 = require('../collections/female/winter.js').data,
	mailer = require('../libs/mailer.js'),
	Share = require('../libs/share.js'),
	nodemailer = require('nodemailer'),
	path = require('path'),
	templatesDir = path.resolve(__dirname, '..', 'views/mailer/templates'),
	emailTemplates = require('email-templates');


exports.index = function(req, res){
  res.render('index');
};

exports.onboarding = function(req, res) {
	res.send(200);
};

exports.collection = function(req, res) {
	var round = req.params.round,
		gender = req.params.gender,
		products = null;

	if(gender == "male") {
		if(round == 1) {
			products = maleCollection1.products;
		} else if(round == 2)  {
			products = maleCollection2.products;
		}
	} else { // gender is female
		if(round == 1) {
			products = femaleCollection1 .products;
		} else {
			products = femaleCollection2.products;
		}
	}

	res.render('collection', {
		"products": products
	});
};

exports.likes = function(req, res) {
	res.render('likes');
}

exports.email = function(req, res) {
	res.render('email');
}

exports.emailSend = function(req, res) {
	var m = new mailer();
	m.email(req.body.emailAddress, function() {
		res.send(200);
	});
}

exports.feedback = function(req, res) {
	res.render('feedback');
};

exports.feedbackSend = function(req, res) {
	var m = new mailer();
	m.feedback(req.body.email, req.body.feedback, function() {
		res.send(200);
	})
};

exports.share = function(req, res) {
	var postData = req.body.data;
	var s = new Share();
	var base = "http://weaveuk.com/share/";
	s.new(postData.ownerEmail, postData.ownerName, postData.ownerGender, postData.ownerAge, postData.collectionName, postData.products, function(_id) {
		base += _id;
		console.log(base);
		res.send(base);
	});
}

exports.enterViaShare = function(req, res) {
	var shareId = req.params.shareId;
	var s = new Share();
	s.getShareDetails(shareId, function(result) {
		console.log(result);
		if(result == null) {
			res.send("No such share");
		}
		res.render('friend', {"results": result});
	});
}

exports.feedbackReturned = function(req, res) {
	var data = req.body.data;
	var s = new Share();
	s.getShareDetails(data._id, function(result) {
		console.log(data.products);
		console.log(data.friendName);
		console.log(result.ownerEmail);
		console.log(result.ownerName);
		//console.log(result);
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
				products: data.products
			};

			template('friend', locals, function(err, html) {
				if(err) {
					throw err;
				}
				smtpTransport.sendMail({
					from: "Weave Team <andy@weaveuk.com>",
					to: locals.email,
					subject: locals.friend + " has completed your Collection",
					html: html,
					generateTextFromHTML: true
				}, function(err, responseStatus) {
					if(err) {
						throw err;
					}
					console.log('SUCCESS');
					console.log(responseStatus.message);
				})
			})
		})
		res.status(200).send();
	})
}