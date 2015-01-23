var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db_name');

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.route('/login')
	// show the form (GET login)
	.get(function(req, res) {
		res.sendFile(path.join(__dirname + '/index.html'));
	})
	// process the form (POST login)
	.post(function(req, res) {
		console.log('processing');
		res.send('processing the login form!');
	});

// create routes for the admin section
// get an instance of the router
var adminRouter = express.Router();

adminRouter.use(function(req, res, next) {
	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();
});

adminRouter.param('name', function(req, res, next, name) {
	// do validation on name here
	// validate
	// log something so we know its working
	console.log('doing name validations on ' + name);

	req.name = name;
	// to the next thing
	next();
});

// admin main page: the dashboard
adminRouter.get('/', function(req, res) {
	res.send('I am the dashboard!');
});

// users page
adminRouter.get('/users', function(req, res) {
	res.send('I show all users!');
});

adminRouter.get('/posts', function(req, res) {
	res.send('I show all posts');
});

adminRouter.get('/users/:name', function(req, res) {
	res.send('hello ' + req.params.name + '!');
});

app.use('/admin', adminRouter);

var listener = app.listen(1337, function() {
	console.log("Listening on %s:%d", listener.address().address, listener.address().port);
});
