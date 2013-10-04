/*
	Module that handles collections
*/

var db = require('mongoskin').db('weave:weave2013@ds047948.mongolab.com:47948/weave');

module.exports = function() {
	
	this.getCollections = function(collectionName, callback) {
		var shopArray = ["H&M", "ASOS"];

		db.collection("products").find({collectionDate: collectionName, shop:{$in:shopArray}}).toArray(function (err, result) {
			if (err) throw err;
			callback(result);
		});
	}

	this.allCollections = function(callback) {
		db.collection("products").find().toArray(function (err, result) {
			if (err) throw err;
			var collections = [];

			for(var i = 0; i < result.length; i++) {
				var date = result[i].collectionDate;
				if (collections.indexOf(date) ==  -1) {
					collections.push(date);
				}
			}
			callback(collections);
		});
	}

	this.userCollections = function(userUDID, cb) {
		db.collection("userCollections").find({UDID: userUDID}).toArray(function (err, result) {
			if (err) throw err;
			//console.log('User Collections');
			//cb(result[0].collectionsSeen);
			console.log('hello world');
			cb(result[0].collectionsSeen);
			//var seen = result[0].collectionsSeen;
			//callback(seen);
		})
	}

	this.userToSee = function(userUDID, callback) {
		var that = this
		that.allCollections(function (result) {
			that.userCollections(userUDID, function(userCollections) {
				var toSee = [];
				for (var i = 0; i < result.length; i++) {
					if (result.indexOf(userCollections[i]) == -1) {
						toSee.push(result[i]);
					}
				}
				callback(toSee);
			});
		});
	}

}
