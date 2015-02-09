// BASE SETUP
// ==========
var config     = require('./config')
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var path       = require('path');


// APP Config----
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORSE requests:
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database);

// set statuc files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// Routes for our API
// ==================
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes)

// main catchall route
// send users to frontend
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

// Start the server
// ==================
app.listen(config.port, function() {
	console.log('Magic happens on port ' + config.port);
});
