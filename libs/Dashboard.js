/* Module that makes the dashboard */

var db = require('mongoskin').db("mongodb://weave:weave2013@paulo.mongohq.com:10000/weave-dev"),
	async = require('async'),
	sugar = require('sugar');

module.exports = function() {
	/* Pull and display the database */

	this.getData = function(callback) {
		db.collection('product-dashboard').find().toArray(function (err, result) {
			if (err) throw err;
			
			callback(result);
		});
	}		
};