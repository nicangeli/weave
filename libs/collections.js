/*
	Module that handles collections
*/

var db = require('mongoskin').db(require('../common/db.js').db),
	async = require('async');


module.exports = function() {
	
	//this.activeCollections = ['Rock & Roll', 'Punk', 'Darling Dresses', 'Pretty'];
	this.activeCollections = [
									{
										"name": "Date Night",
										"comment": "Look special"
									},
									{
										"name": "Glam-Rock",
										"comment": ""	
									},
									{
										"name": "Punk-II",
										"comment": "Rip it up in tartan, leather & studs"
									},
									{
										"name": "Statement Sweatshirts",
										"comment": "Be bold"
									},
									{
										"name": "Party",
										"comment": "A small collection of party pieces"
									},
										{
										"name": "Winter Coats",
										"comment": "24 reasons to leave the house"
									},
									{
										"name": "Punk",
										"comment": "Rip it up in tartan, leather & studs"	
									},
									{
										"name": "Nasty Gal",
										"comment": "New In!"
									},
									{
										"name": "Pretty",
										"comment": "Tea Dresses, mostly"
									},
									{
										"name": "Shoes-Shoes-Shoes",
										"comment": "Caveat Emptor - $$$ "
									},
									{
										"name": "Weekend",
										"comment": "Cute comfy casuals"
									},
									{
										"name": "Wildcard",
										"comment": "Feeling Lucky?"
									},
									{
										"name": "Rock & Roll",
										"comment": ""
									},
									{
										"name": "Skater",
										"comment": ""
									},
									{
										"name": "Work",
										"comment": "Smart work wear for the professional lady"
									},
									{
										"name": "Work Bag",
										"comment": "Essentials for the handbag"
									},
									{
										"name": "Pretty",
										"comment": "All things georgeous"
									}
							];

	this.getActiveCollections = function(myCallback) {
		var collections = [];
		async.forEach(this.activeCollections, function(collection, callback){
			db.collection(collection.name).find().toArray(function(err, result) {
				if(err) {
					throw err;
				}
				var imageUrls = [result[0].imageUrl, result[1].imageUrl, result[2].imageUrl, result[3].imageUrl, result[4].imageUrl];
				if(result[0] != undefined) {
					collections.push({
						"name": collection.name,
						"size": result.length,
						"imageUrls": imageUrls,
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