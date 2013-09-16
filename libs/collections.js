/*
	Module that handles collections
*/

var db = require('mongoskin').db(require('../common/db.js').db),
	async = require('async');


module.exports = function() {
	
	//this.activeCollections = ['Rock & Roll', 'Punk', 'Darling Dresses', 'Pretty'];
	this.activeCollections = [
									{
										"name": "Rock & Roll",
										"comment": "A nod to Kate & Co"
									},
									{
										"name": "Punk",
										"comment": "Rip it up in tartan, leather & studs"	
									},
									{
										"name": "Darling Dresses",
										"comment": "11 show stoppers"
									},
									{
										"name": "Pretty",
										"comment": "Tea Dresses, mostly"
									}
							];

	this.getActiveCollections = function(myCallback) {
		var collections = [];
		async.forEach(this.activeCollections, function(collection, callback){
			db.collection(collection.name).find().toArray(function(err, result) {
				if(err) {
					throw err;
				}
				if(result[0] != undefined) {
					collections.push({
						"name": collection.name,
						"size": result.length,
						"imageUrl": result[0].imageUrl,
						"comment": collection.comment
					});
				} else {
					collections.push({
						"name": collection.name,
						"size": result.length,
						"comment": collection.comment
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