/*
share.js
file that accepts a collection and inserts them into a database, returning a unique URL to them
*/

var db = require('mongoskin').db('mongodb://nodescript:nodescript@ds043338.mongolab.com:43338/heroku_app17946852');
var bson = require('mongoskin').BSONPure;

module.exports = function() {

	this.new = function(ownerEmail, ownerName, ownerGender, ownerAge, collectionName, products, callback) {
		db.collection('shares').insert(
			{
				"ownerEmail": ownerEmail,
				"ownerName": ownerName,
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
					callback(result[0]._id);
				}
			}
		)
	};

	this.getShareDetails = function(id, callback) {
		db.collection('shares').findOne({"_id": bson.ObjectID(id)}, function(err, result) {
			if(err) {
				throw err;
			}
			callback(result);
		});
	};

}

