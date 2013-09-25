//models/user.js
var mongoose = require('mongoose');
var hash = require('../common/hash');

UserSchema = mongoose.Schema({
	name: 		String,
	email:      String,
	salt:       String,
	hash:       String,
	facebook:{
		id:       String,
		email:    String,
		name:     String
	},
	collectionsPlayed: [
		{
			name: String,
			likes: [
				{
					url: String,
					imageUrl: String,
					price: String,
					brand: String,
					shop: String,
					title: String,
					type: String,
					tags: [String],
					comment: String
				}
			],
			dislikes: [
				{
					url: String,
					imageUrl: String,
					price: String,
					brand: String,
					shop: String,
					title: String,
					type: String,
					tags: [String],
					comment: String
				}
			]
		}
	]
});

UserSchema.statics.insertLike = function(user, collectionName, product, done) {
	console.log('inserting like')
	var User = user;
	//User.findOne({})
	// find the correct collection
	var collections = User.collectionsPlayed;
	var collection = findCollection(collections, collectionName);
	if(collection != null) {
		// correct collection, insert into likes
		collection.likes.push(product);
	} else {
		// must be the first like / dislike on this collection
		var tmp = {
			name: collectionName,
			likes: [
				product
			]
		}
		collections.push(tmp);
	}
	User.save();
	console.log(collections);
}

UserSchema.statics.signup = function(name, email, password, done){
	var User = this;
	hash(password, function(err, salt, hash){
		if(err) throw err;
		// if (err) return done(err);
		User.create({
			name: name,
			email : email,
			salt : salt,
			hash : hash
		}, function(err, user){
			if(err) throw err;
			// if (err) return done(err);
			done(null, user);
		});
	});
}

UserSchema.statics.isValidUserPassword = function(email, password, done) {
	this.findOne({email : email}, function(err, user){
		// if(err) throw err;
		if(err) return done(err);
		if(!user) return done(null, false, { message : 'Incorrect email.' });
		hash(password, user.salt, function(err, hash){
			if(err) return done(err);
			if(hash == user.hash) return done(null, user);
			done(null, false, {
				message : 'Incorrect password'
			});
		});
	});
}

UserSchema.statics.findOrCreateFaceBookUser = function(profile, done){
	var User = this;
	this.findOne({ 'facebook.id' : profile.id }, function(err, user){
		if(err) throw err;
		// if (err) return done(err);
		if(user){
			done(null, user);
		}else{
			User.create({
				email : profile.emails[0].value,
				facebook : {
					id:    profile.id,
					email: profile.emails[0].value,
					name:  profile.displayName
				}
			}, function(err, user){
				if(err) throw err;
				// if (err) return done(err);
				done(null, user);
			});
		}
	});	
}

var findCollection = function(collectionsArr, collectionName) {
	for(var i = 0; i < collectionsArr.length; i++) {
		if(collectionsArr[i].name == collectionName) {
			return collectionsArr[i];
		}
	}
	return null;

}


var User = mongoose.model("User", UserSchema);
module.exports = User;