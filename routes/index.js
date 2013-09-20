
/*
 * GET home page.
 */





exports.index = function(req, res){
  res.render('index');
};

exports.onboarding = function(req, res) {
	res.send(200);
};

exports.collection = function(req, res) {
	var collection = req.params.collectionName;
	var c = new Collections();
	c.getCollection(collection, function(products) {
		res.render('collection', {
			"products": products,
			"collectionName": collection
		});
	})


};

exports.showCollections = function(req, res) {
	var c = new Collections();
	c.getActiveCollections(function(sizes) {
		console.log(sizes);
		res.render('collections', {"data": sizes});
	});
};

exports.likes = function(req, res) {
	res.render('likes');
}

exports.email = function(req, res) {
	res.render('email');
}

exports.emailSend = function(req, res) {
	var m = new mailer();
	m.email(req.body.emailAddress, function() {
		res.send(200);
	});
}

exports.feedback = function(req, res) {
	res.render('feedback');
};

exports.feedbackSend = function(req, res) {
	var m = new mailer();
	m.feedback(req.body.email, req.body.feedback, function() {
		res.send(200);
	})
};

exports.share = function(req, res) {
	var postData = req.body.data;
	var s = new Share();
	var base = "http://weaveuk.com/share/";
	s.new(postData.ownerEmail, postData.ownerName, postData.ownerGender, postData.ownerAge, postData.collectionName, postData.products, function(_id) {
		base += _id;
		console.log(base);
		res.send(base);
	});
}

exports.enterViaShare = function(req, res) {
	var shareId = req.params.shareId;
	var s = new Share();
	s.getShareDetails(shareId, function(result) {
		//console.log(result);
		for(var i = 0; i < result.products.length; i++) {
			console.log(i);
			console.log(result.products[i].imageUrl);
		}
		if(result == null) {
			res.send("No such share");
		}
		res.render('friend', {"results": result});
	});
}

exports.feedbackReturned = function(req, res) {
	var data = req.body.data;
	console.log(data);
	var s = new Share();
	s.getShareDetails(data._id, function(result) {

		//console.log(result);
		emailTemplates(templatesDir, function(err, template) {
			if(err) {
				throw err;
			}
			var smtpTransport = nodemailer.createTransport("SMTP", {
				service: "Zoho", 
				auth: {
					user: "andy@weaveuk.com",
					pass: "weave2013"
				}
			});

			var locals = {
				email: result.ownerEmail,
				friend: data.friendName,
				name: result.ownerName,
				products: data.products,
				collection: result.collectionName,
				comment: data.comment
			};

			template('friend', locals, function(err, html) {
				if(err) {
					throw err;
				}
				smtpTransport.sendMail({
					from: "Weave Team <andy@weaveuk.com>",
					to: locals.email,
					bcc: 'Admin <nick@weaveuk.com>',
					subject: locals.friend + " has completed your Collection",
					html: html,
					generateTextFromHTML: true
				}, function(err, responseStatus) {
					if(err) {
						throw err;
					}
					console.log('SUCCESS');
					console.log(responseStatus.message);
					res.status(200).send();

				})
			})
		})
		//res.status(200).send();
	})
}