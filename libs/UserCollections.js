/*
	Module that handles collections
*/

var db = require('mongoskin').db('weave:weave2013@ds047948.mongolab.com:47948/weave');

module.exports = function() {
	
	/*
		Get collection out of db
	*/
	this.getCollections = function(collectionName, shops, callback) {
		var shopArray = shops;

		var query = {
			collectionDate: collectionName
		};
		if(shopArray != null) {
			query.shop = {$in:shopArray}
		}

		db.collection("products").find(query).toArray(function (err, result) {
			if (err) throw err;
			callback(result);
		});
	}

	/*
		List of all the collections in the database, 
		['Thu 04 Oct 2012', 'Tue 02 Nov 2011'] etc
	*/
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

	/*
		Called to update which collections the user has seen
	*/
	this.updateUserSeen = function(userUDID, collectionSeen) {
		db.collection('userCollections').update({UDID: userUDID}, {'$push': {collectionsSeen: collectionSeen}}, function(err) {
			if(err) throw err;
			console.log('Successfully updated ' + collectionSeen);
		})
	}

	/*
		Which collections has the user seen?
	*/
	this.userCollections = function(userUDID, cb) {
		db.collection("userCollections").find({UDID: userUDID}).toArray(function (err, result) {
			if (err) throw err;
			//cb(result[0].collectionsSeen);
			if(result.length == 0) { // UDID not in db, must be first request
				var doc = {
					UDID: userUDID,
					collectionsSeen: []
				};
				db.collection('userCollections').insert(doc, function(err, result) {
					if(err) throw err;
					if(result) {
						console.log('Added new UDID to db');
						cb(result[0].collectionsSeen);
					}
				})
			} else {
				cb(result[0].collectionsSeen);
			}
			//var seen = result[0].collectionsSeen;
			//callback(seen);
		})
	}

	/*
		Which date should the user be shown next?
	*/
	this.userToSee = function(userUDID, callback) { 
		var that = this
		that.allCollections(function (result) {
			console.log('All collections: ' + result);
			that.userCollections(userUDID, function(userCollections) {
				console.log('User Collections: ' + userCollections);
				var toSee = [];
				for (var i = 0; i < result.length; i++) {
					if (userCollections.indexOf(result[i]) == -1) {
						toSee.push(result[i]);
					}
				}

				for(var i = 0; i < toSee.length; i++) {
					toSee[i] = new Date(toSee[i]);
				}
				toSee.sort(date_sort_desc);
				callback(toSee);
			});
		});
	}

}

var date_sort_desc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // DESCENDING order.
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};
