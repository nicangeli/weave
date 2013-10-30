/* Module that makes the dashboard */

var db = require('mongoskin').db("mongodb://weave:weave2013@paulo.mongohq.com:10000/weave-dev"),
	async = require('async'),
	sugar = require('sugar'),
	chrono = require('chrono-node');

	var shopArray = [];
	var dayArray = [];
	var magicObject = {};
	var data;

	// Create 14 day array to get data for past 14 days
	var i = 1
	var day1 = chrono.parse("14 days ago")[0].startDate;
	dayArray.push(day1.toDateString());

	for (i = 1; i < 14; i++) {
		nextDay = new Date()
		nextDay.setDate(day1.getDate() + i);
		dayArray.push(nextDay.toDateString());
	}

	console.log(dayArray);
	
async.series([
	function (callback) {
		// Get all the fucking products which we call data (I should be wanking right now)
		db.collection('products').find().toArray(function (err, result) {
			console.log("In the first async operation");
			if (err) throw err;
	
			data = result;

			console.log(data.length);
			console.log("end of first async op (should come immediately)")
			callback();
		});
	},
	function (callback) {
		//Dynamically create shop Array, it depends on what Shops/brands we are scraping
		console.log("in the second async")
		data.each(function (product) {
			// Add a new shop from data iteration if it isn't already in shopArray
			if (shopArray.indexOf(product.shop) == -1) {
				shopArray.push(product.shop)
			}
		});
		console.log(shopArray);
		console.log("At the end of second callback")
		callback();
	},
	function (callback) {
		console.log("in the third async")
		shopArray.each(function (shop) {
			dayArray.each(function (day) {
				data.each(function (product) {
					// If we get a product from the correct shop and day that we are iterating over... stick it into the magicObject
					if (product.shop == shop && product.collectionDate == day) {
						console.log(shop + day);
						console.log(magicObject);
						console.log(magicObject.hasOwnProperty(shop));

						// How the fuck do I create 
						// obj = {Mango : {Monday : 3, Tuesday : 12}, Topshop : {Monday : 24, Tuesday : 43}}
						if (magicObject.hasOwnProperty(shop) == false) {
							magicObject[shop] = {};
						}
						else if (magicObject[shop].hasOwnProperty(day) == false) {
							magicObject[shop][day] = 1;
						}
						else if (magicObject.hasOwnProperty(shop) == true && magicObject[shop].hasOwnProperty(day) == true) {
							magicObject[shop][day] = magicObject[shop][day] + 1;
						}
					}
				});
			});
		});
		console.log(magicObject)
		callback();
	}
],
function (err) {
	if (err) return next(err);
	db.collection("product-dashboard").insert(magicObject)
	console.log("finished")
});