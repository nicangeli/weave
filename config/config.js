//config/config.js

module.exports = {
	db: 'mongodb://weave:weave2013@paulo.mongohq.com:10028/weave-production_copy',
	app: {
		name: 'Weave - Fashion discovery'
	},
	facebook: {
		clientID: "513046895449103",
		clientSecret: "9927b307785c3705e0bd25bb82c119f7",
		callbackURL: "http://www.weaveuk.com/auth/facebook/callback"
	}
};