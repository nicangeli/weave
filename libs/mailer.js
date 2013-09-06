var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Zoho",
    auth: {
        user: "nick@weaveuk.com",
        pass: "fsh2KhsdhHeZw99WuHfZ"
    }
});

module.exports = function() {

	this.share = function(emails, callback) {	

		var mailOptions = {
		    from: "Nick Angeli <nick@weaveuk.com>", // sender address
		    to: emails.join(", "), // list of receivers
		    subject: "Your friend thought you'd like Weave...", // Subject line
		    text: "Hi, \nyour friend thought that you'd like http://weaveuk.com. \nHave a play and let us know what you think. \nNick", // plaintext body
		    html: "Hi, \nyour friend thought that you'd like http://weaveuk.com. \nHave a play and let us know what you think. \nNick" // html body
		}

		smtpTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		
		    }
		});

		callback();

	},

	this.feedback = function(email, feedbackBody, callback) {

		var mailOptions = {
		    from: "Nick Angeli <nick@weaveuk.com>", // sender address
		    to: "nicangeli@gmail.com, chloedonegan@gmail.com, brownie3003@gmail.com", // list of receivers
		    subject: "feedback from Weave", // Subject line
		    text: "FROM:" + email + " BODY: " + feedbackBody, // plaintext body
		    html: "FROM:" + email + " BODY: " + feedbackBody, // plaintext body
		};

		smtpTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        callback();
		    }
		});
	}

};