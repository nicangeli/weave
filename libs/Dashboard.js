/* Module that makes the dashboard */

var db = require('mongoskin').db("mongodb://weave:weave2013@paulo.mongohq.com:10000/weave-dev"),
	async = require('async'),
	sugar = require('sugar');

module.exports = function() {
	/* Pull and display the database */

	this.getData = function(callback) {
<<<<<<< HEAD
		var shopArray = [];
		var magicObject = {};
		
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
				shopArray.each(function (shopName) {
					dayArray = []
					async.series([
						function (callback) {
							db.collection('products').find({shop : shopName}).toArray(function (err, result) {
								console.log("In the second async operation")
								if (err) throw err;

								var shopData = result
								
								for (var element in shopData) {
									var product = shopData[element];
									if (dayArray.indexOf(product.collectionDate) == -1) {
										dayArray.push(product.collectionDate);
									};
								};
								console.log(shopName);
								console.log(dayArray);

								dayArray.each(function (day) {
									db.collection('products').find({shop : shopName, collectionDate : day}).toArray(function (err, result) {
										if (err) throw err;
										console.log("In the final section hopefully");
										console.log("Shop name: " + shopName + ", Collection Date: " + day);
										var dayData = result;
										var numberOfProducts = dayData.length;
										console.log("This day has: " + numberOfProducts + " products");
									})
								})

								magicObject[shopName] = dayArray

								console.log(magicObject);

								// result.each(function(key, value) {
								// 	console.log(key, value)
								// })

								// console.log(shopName + " has this many items " + shopCount);
							});							
						},
						function (callback) {
							console.log("In the final section of async")
							magicObject[shopName] = dayArray;

							console.log(magicObject);
						}
					], function (err) {
						if (err) return next(err);
						callback(magicObject)
					})
				});
			}
		], function (err) {
			if (err) return next(err);
			callback(shopArray);
		});
	};
=======
		db.collection('product-dashboard').find().toArray(function (err, result) {
			if (err) throw err;
			
			callback(result);
		});
	}		
>>>>>>> Dashboard
};