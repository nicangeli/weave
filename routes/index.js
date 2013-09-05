
/*
 * GET home page.
 */

var collection1 = require('../collections/first.js').data,
	collection2 = require('../collections/second.js').data,
	mailer = require('../libs/mailer.js');


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.onboarding = function(req, res) {
	res.send(200);
};

exports.collection = function(req, res) {
	var round = req.params.round,
		products = null;

	if(round == 1) {
		products = collection1.products;
	} else {
		products = collection2.products;
	}

	console.log(products);

	res.render('collection', {
		"products": products
	});
};

exports.likes = function(req, res) {
	res.render('likes');
}

exports.share = function(req, res) {
	res.render('share');
}

exports.shareSend = function(req, res) {
	var m = new mailer();
	m.share(req.body.emailAddresses, req.body.names, function() {
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