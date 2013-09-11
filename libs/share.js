/*
share.js
file that accepts a collection and inserts them into a database, returning a unique URL to them
*/

var db = require('mongoskin').db('mongodb://nodescript:nodescript@ds043338.mongolab.com:43338/heroku_app17946852');

module.exports = function() {

	this.new = function(ownerEmail, ownerGender, ownerAge, collectionName, products, callback) {
		db.collection('shares').insert(
			{
				"ownerEmail": ownerEmail,
				"ownerGender": ownerGender,
				"ownerAge": ownerAge,
				"collectionName": collectionName,
				"products": products
			}, function(err, result) {
				if(err) {
					throw err;
				}
				if(result) {
					console.log('Inserted successfully')
					//console.log(result[0]._id);
					callback(result[0]._id);
				}
			}
		)
	};

}

