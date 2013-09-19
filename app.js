
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport');

var config = require('./config/config.js');

mongoose.connect(config.db);
    
var models_dir = __dirname + '/models';
fs.readdirSync(models_dir).forEach(function (file) {
  if(file[0] === '.') return; 
  require(models_dir+'/'+ file);
});

require('./config/passport')(passport, config);

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: "AHFHIOHWIUSHSKFBKJSBFUIHFWUORY72847HKF"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
app.configure('development', function () {
  app.use(express.errorHandler());
});
/*
app.get('/', routes.index);
app.post('/onboarding', routes.onboarding);
app.get('/collections', routes.showCollections);
app.get('/collection/:collectionName', routes.collection);
app.get('/likes', routes.likes);
app.get('/email', routes.email);
app.post('/email', routes.emailSend);
app.get('/feedback', routes.feedback);
app.post('/feedback', routes.feedbackSend);

app.post('/share', routes.share);
app.get('/share/:shareId', routes.enterViaShare);
app.post('/friend/feedback', routes.feedbackReturned);

app.get('/skim', function(req, res) {
	res.render('skim');
});
*/
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});

require('./config/routes')(app, passport);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
