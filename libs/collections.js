/*
	Module that handles collections
*/

var db = require('mongoskin').db(require('../common/db.js').db),
	async = require('async');


module.exports = function() {
	
	this.activeCollections = ['Trousers', 'Shirts', 'Tops', 'Winter Coats'];

	this.getActiveCollections = function(myCallback) {
		var collections = [];
		async.forEach(this.activeCollections, function(collection, callback){
			db.collection(collection).find().toArray(function(err, result) {
				if(err) {
					throw err;
				}
				if(result[0] != undefined) {
					collections.push({
						"name": collection,
						"size": result.length,
						"imageUrl": result[0].imageUrl
					});
				} else {
					collections.push({
						"name": collection,
						"size": result.length
					});	
				}
				callback();
			});
		}, function(err) {
			if(err) 
				throw err;
			myCallback(collections);
		})
	}

	this.getCollection = function(collection, callback) {
		db.collection(collection).find().toArray(function(err, result) {
			if(err)
				throw err;
			callback(result);
		})
	}


}