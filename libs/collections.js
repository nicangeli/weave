/*
	Module that handles collections
*/

var db = require('mongoskin').db(require('../common/db.js').db),
	async = require('async');


module.exports = function() {
	
	//this.activeCollections = ['Rock & Roll', 'Punk', 'Darling Dresses', 'Pretty'];
	this.activeCollections = [
									{
										"name": "Autumn",
										"comment": "",
										"author": "Miranda Hadfield"
									},
									{
										"name": "Chic",
										"comment": "",
										"author": "Madeleine Nosworthy"
									},
									{
										"name": "Pick-n-Mix",
										"comment": "",
										"author": "Alice Bentinck"
									},
									{
										"name": "Date Night",
										"comment": "Something special",
										"author": "Weave Original"
									},
									{
										"name": "Glam-Rock",
										"comment": "Inspired by Kate & Co",
										"author": "Alexa Felix"
									},
									{
										"name": "Punk-II",
										"comment": "Rip it up in tartan, leather & studs",
										"author": "Alice Brown",
									},
									{
										"name": "Statement Sweatshirts",
										"comment": "Be bold",
										"author": "Lucy Gardner"
									},
									{
										"name": "Party",
										"comment": "A small collection of party pieces",
										"author": "Lucy Gardner"
									},
										{
										"name": "Winter Coats",
										"comment": "24 reasons to leave the house",
										"author": "Simone Grand"
									},
									{
										"name": "Punk",
										"comment": "Rip it up in tartan, leather & studs",
										"author": "Christine Hamel"	
									},
									{
										"name": "Nasty Gal",
										"comment": "New In!",
										"author": "Nicola Trent"
									},
									{
										"name": "Pretty",
										"comment": "Tea Dresses, mostly",
										"author": "Chloe Donegan"
									},
									{
										"name": "Shoes-Shoes-Shoes",
										"comment": "Caveat Emptor - $$$ ",
										"author": "Stylist"
									},
									{
										"name": "Weekend",
										"comment": "Cute comfy casuals",
										"author": "Mary Angeli"
									},
									{
										"name": "Wildcard",
										"comment": "Feeling Lucky?",
										"author": "Marsha Lewitt"
									},
									{
										"name": "Rock & Roll",
										"comment": "",
										"author": "Weave Original"
									},
									{
										"name": "Skater",
										"comment": "Trending",
										"author": "Weave Original"
									},
									{
										"name": "Work",
										"comment": "Suits are boring",
										"author": "Weave Original"
									},
									{
										"name": "Work Bag",
										"comment": "Smart Style",
										"author": "Chloe Donegan"
									}

							];

	this.getActiveCollections = function(myCallback) {
		this.activeCollections = shuffle(this.activeCollections);
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
						"comment": collection.comment,
						"author": collection.author
					});
				} else {
					collections.push({
						"name": collection.name,
						"size": result.length,
						"comment": collection.comment,
						"author": collection.author
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

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};