/* Module that makes the dashboard */

var db = require('mongoskin').db("mongodb://weave:weave2013@paulo.mongohq.com:10000/weave-dev"),
	async = require('async'),
	sugar = require('sugar');

module.exports = function() {
	/* Pull and display the database */

	this.getData = function(callback) {
		var shopArray = [];
		
		async.series([
			function (callback) {
				db.collection('products').find().toArray(function (err, result) {
					console.log("In the first async operation");
					if (err) throw err;
					var data = result;

					//console.log(data.length);

					for (var element in data) {
						var product = data[element];
						if (shopArray.indexOf(product.shop) == -1) {
							shopArray.push(product.shop);
						};
					};
					console.log(shopArray);
					callback();
				});
			},
			function (callback) {
				shopArray.each(function(shopName) {
					db.collection('products').find({shop : shopName}).toArray(function (err, result) {
						console.log("In the second async operation")
						if (err) throw err;

						var shopData = result
						var shopCount = result.length

						result.each(function(key, value) {
							console.log(key, value)
						})

						console.log(shopName + " has this many items " + shopCount);
					});
				});
			}
		], function (err) {
			if (err) return next(err);
			callback(shopArray);
		});
	};
};