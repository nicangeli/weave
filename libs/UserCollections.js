/*
	Module that handles collections
*/

var db = require('mongoskin').db('weave:weave2013@ds047948.mongolab.com:47948/weave');

module.exports = function() {
	
	this.getCollections = function(callback) {
		var collectionRequired = "Fri Oct 04 2013";
		var shopArray = ["H&M", "Zara", "ASOS"];


		db.collection("products").find({collectionDate: collectionRequired, shop:{$in:shopArray}}).toArray(function (err, result) {
			if (err) throw err;
			callback(result);
		});
	}

	this.allCollections = function(callback) {
		console.log("dadada")
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

	this.userCollections = function(userUDID, callback) {
		db.collection("userCollections").find({UDID: userUDID}).toArray(function (err, result) {
			if (err) throw err;
			callback(result[0].collectionsSeen);
		})
	}

	this.userToSee = function(userUDID, callback) {
		var that = this
		that.allCollections(function (result) {
			console.log(result);
			that.userCollections(userUDID, function(userCollections) {
				console.log(userCollections);
				console.log(userCollections.indexOf(result[i]));
				var toSee = [];
				for (var i = 0; i < result.length; i++) {
					if (result.indexOf(userCollections[i]) == -1) {
						toSee.push(result[i]);
						console.log("Testing logic");
					}
				}
				callback(toSee);
			});
		});
	}

}
