
/*
 * GET home page.
 */

var collection1 = require('../collections/first.js').data,
	collection2 = require('../collections/second.js').data;


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