/*
	Module that handles collections
*/

var db = require('mongoskin').db(require('../common/dj.js').db);


module.exports = function() {
	
	this.activeCollections = ['Trousers', 'Shirts', 'Tops'];

	this.getActiveCollections = function() {
		return this.activeCollections;
	}

	this.getCollection = function(collection, callback) {
		db.collection(collection).find({}, function(err, result) {
			callback(result);
		})
	}


}