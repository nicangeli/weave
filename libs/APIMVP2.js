/*
	Module that handles collections
*/
var config = require('../config/config.js'),
	db = require('mongoskin').db("mongodb://<user>:<password>@paulo.mongohq.com:10000/weave-dev"),
	async = require('async');

module.exports = function() {


	this.getAllShops = function(cb) {
		db.collection('products').find().toArray(function(err, products) {
			if(err) throw err;
			var shops = [];
			for(var i = 0; i < products.length; i++) {
				var product = products[i];
				if(shops.indexOf(product.shop) == -1) {
					shops.push(product.shop);
				}
			}
			cb(shops);
		})
	}


	this.hasUserSeenShopForDate = function(UDID, shopDate, callback) {
		/*
			For what is of the form: {
				shop: "Shop name",
				collectionDate: "Thu Oct 12 2013"
			}
		*/
		db.collection('Users').find({UDID: UDID}).toArray(function(err, result) {
			if(err) throw err;
			result = result[0];
			// get the right object out of the seen array
			if(result == undefined) {
				console.log("MEMMEME")
				callback(false);
			} else {
				var seen = result.seen; // everything that the user has seen
				//console.log(seen);
				var shopObject = null;
				for(var i = 0; i < seen.length; i++) {
					//console.log(i)
					var element = seen[i];
					if(element.shop == shopDate.shop) {
						// this is the object we care about
						shopObject = element;
					}
				}
				if(shopObject == null) {
					// we have never seen this shop before
					console.log("this one");

					callback(false);
				} else {
					if(shopObject.collectionDate == shopDate.collectionDate) {
						// we have seen todays data..
						console.log(shopObject.collectionDate);
						console.log(shopDate.collectionDate);
						callback(true);
					} else {
						console.log("Not seen");
						callback(false);
					}
				}
			}
		});
	}

	this.all = function(UDID, cb) {
		var collectionDatePairings = [],
			shops = [ 'Topshop',
					  'Zara',
					  'H&M',
					  'ASOS',
					  '& Other Stories',
					  'Anthropologie',
					  'Mango'],
			that = this,
			products = [];

			async.forEach(shops, function(shop, callback) {
				that.lastCollectionForShop(shop, function(data) {
					collectionDatePairings.push(data);
					callback();
				})
			}, function(err) {
				if(err) throw err;
				// do somethinng at the end 
				async.forEach(collectionDatePairings, function(cdp, callback) {
					that.hasUserSeenShopForDate(UDID, cdp, function(seen) {
						var thus = that;
						if(!seen) {
							thus.getCollection(cdp, function(result) {
								//console.log(result);
								for(var i = 0; i < result.length; i++) {
									products.push(result[i]);
								}
								callback();
							});
						} else {
							callback();
						}
					});
					
				}, function(err) {
					if (err) throw err;
					that.updateAllForWhats(UDID, collectionDatePairings);
					cb(products);
				})
			});
	}
	
	
	/*
		Get last collection for a shop
	*/
	this.lastCollectionForShop = function(shopName, callback) {
		db.collection('products').find({shop: shopName}).toArray(function(err, result) {
			if(err) throw err;
			var collections = [];

			for(var i = 0; i < result.length; i++) {
				var date = result[i].collectionDate;
				if (collections.indexOf(date) ==  -1) {
					//collections.push(date);
					collections.push(new Date(date));
				}
			}

			collections.sort(date_sort_desc);

			for(var i = 0; i < collections.length; i++) {
					collections[i] = collections[i].toDateString();
			}

			callback({
				shop: shopName,
				collectionDate: collections[0]
			}); // send the most recent back
		});
	}

	this.getCollection = function(forWhat, callback) {
		/*
			forWhat is of the form
			{
				shop: "ShopName",
				collectionDate: "Thu Oct 12 2013"
			}
		*/
		db.collection('products').find({shop: forWhat.shop, collectionDate: forWhat.collectionDate}).toArray(function(err, result) {
			if(err) throw err;
			callback(result);
		});
	}

	this.updateUserSeen = function(UDID, forWhat, cb) {
		/*
			forwhat is of the form {
				shop: "ASOS",
				collectionDate: "Thur Oct 12 2013"
			}
		*/
		var toInput = {};
		toInput.UDID = UDID;

		async.series([

			function(callback) {
				// find the user and save the data that we want
				db.collection('Users').find({UDID: UDID}).toArray(function(err, result) {
					result = result[0];
					if(err)throw err;			
					if(result  == undefined) {
						// first time for user
						toInput.seen = [forWhat];
					} else {
						var seen = result.seen;
						for(var i = 0; i < seen.length; i++) {
							var element = seen[i];
							if(element.shop == forWhat.shop) {
								seen.splice(i, 1);
							}
						}
						seen.push(forWhat);
						toInput.seen = seen;
					}
					callback();
				});
			},

			function(callback) {
				// remove the old user 
				db.collection('Users').remove({UDID: UDID}, function(err, result) {
					if(err) throw err;
					callback();

				});
			},

			function(callback) {
				// insert the new user details
				db.collection('Users').insert(toInput, function(err, result) {
					if(err) throw err;
					callback();
				});
			}

		], function(err) {
			if(err) throw err;
			// else we have done the two above tasks... notifiy

			cb(true);
		})

	}

	this.updateAllForWhats = function(UDID, forWhats) {
		/*
			I want to update all of the forWhats in the db
			Get the user out of the db
			Go through their seen array
			if the forwhat shop exists, update it in the pulled out stores
			Remove the user
			Add the new user
		*/
		var user;
		var userSeen; 

		async.series([
			function(callback) {
				db.collection('Users').find({UDID: UDID}).toArray(function(err, result) {
					result = result[0];
					if(err) throw err;
					if(result != null) {
						user = result;
					} else {
						user =  { UDID : UDID };
					}
					callback();
				});
			},

			function(callback) {
				/*
					Go through forWhats
					if the shop exists in the user, update the collectionDate
					if the shop does not exist in the user, push it in
				*/
				var shops = [];
				if(user.seen == undefined) {
					userSeen = [];
				} else {
					userSeen = user.seen;
				} 
				for(var i = 0; i < userSeen.length; i++) {
					var element = user.seen[i];
					shops.push(element);
				}
				for(var i = 0; i < forWhats.length; i++) {
					var forWhat = forWhats[i];

					// does the shop name of this forWhat exist in the user? 
					if(shops.indexOf(forWhat.shop) == -1) { // not in the db, push it
						userSeen.push(forWhat);
					} else {
						// already exists in the seen array, replace it
						userSeen.splice(i, 1);
						userSeen.push(forWhat);
					}
				}

				callback();
				
			},

			function(callback) {
				db.collection('Users').remove({UDID: UDID}, function(err) {
					if(err) throw err;
					callback();
				})
			},

			function(callback) {
				db.collection('Users').insert({UDID: UDID, seen: userSeen}, function(err) {
					if(err) throw err;
				});
			}

		], function(err) {
			if(err) throw err;
		})
	}


	this.getAllCollections = function(UDID, forWhats, callback) {
		/*
			forWhats is [] of {}
			{
				shop: "ShopName",
				collectionDate: "Thu Oct 12 2013"
			}
		*/
		var products = [];
		var that = this;
		async.forEach(forWhats, function(forWhat, callback) {
			that.getCollection(forWhat, function(result) {
				for(var i = 0; i < result.length; i++) {
					products.push(result[i]);
				}
				callback();
			})
		}, function(err) {
			if(err) throw err;
			callback(products);
		});
	}

	/*
		Entry script
	*/
	this.run = function(UDID, shops, cb) {
		console.log(UDID);
		var forWhats = [];
		var that = this;
		async.forEach(shops, function(shop, callback) {
			// get the last collection in the db for each shop
			that.lastCollectionForShop(shop, function(result) {
				// has the user seen that shop
				that.hasUserSeenShopForDate(UDID, result, function(seen) {
					//console.log(shop);
					//console.log(seen);
					if(!seen) { // if the user has not seen the shop for today
						forWhats.push(result);
					}
					callback();
				})
			})
		}, function(err) {
			if(err) throw err;
			// do something here after success... got all of the forWhats
			that.getAllCollections(UDID, forWhats, function(products) { // get all the products
				// update all forWhats so that the user has seen them
				that.updateAllForWhats(UDID, forWhats);
				cb(products);
			});
		})
	}
}

var date_sort_desc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // DESCENDING order.
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};
