
/**
 * Module dependencies.
 */

var express = require('express'),
	stylus = require('stylus')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments

// Stylus

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(stylus.middleware(
	{
		src: __dirname + '/views',
		dest: __dirname + '/public'
	})
);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/onboarding', routes.onboarding);
app.get('/collection/:round', routes.collection);
app.get('/likes', routes.likes);
app.get('/share', routes.share);
app.post('/share', routes.shareSend);
app.get('/feedback', routes.feedback);
app.post('/feedback', routes.feedbackSend);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
