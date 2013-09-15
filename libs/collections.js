/*
	Module that handles collections
*/

var db = require('mongoskin').db(require('../common/db.js').db);


module.exports = function() {
	
	this.activeCollections = ['Trousers', 'Shirts', 'Tops'];

	this.getActiveCollections = function() {
		return this.activeCollections;
	}

	this.getCollection = function(collection, callback) {
		db.collection(collection).find().toArray(function(err, result) {
			if(err)
				throw err;
			callback(result);
		})
	}


}