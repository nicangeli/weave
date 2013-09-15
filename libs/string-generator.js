var mongo = require('mongoskin');

// generate random but unique strings

module.exports = function() {
		
	this.generate = function() {
		var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(''),
			stringLength = 8,
			string = "";

		for(var i = 0; i < stringLength; i++) {
			string += chars[Math.floor(Math.random() * chars.length)];
		}

		return string;
	}

	this.isUnique = function(string) {
		// get all strings from the db to check
		mongo.db(require('../common/dj.js').db).collection('shares').findOne({'shareId': string}, function(err, match) {
			if(err) {
				throw err;
			}
			if(match != null) {
				return false;
			} else {
				return true;
			}
		});
	}


}