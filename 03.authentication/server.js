// BASE SETUP
// ==========
require('dot-env');
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var jwt        = require('jsonwebtoken');
var port       = process.env.PORT || 8080;

// connect to our database (hosted on modulus.io)
mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/m9uMimoq')

var superSecret = process.env.SUPER_SECRET || 'ilovepugs';

var User = require('./app/models/user');

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

// Routes for our API
// ==================

// basic route for the home page
app.get('/', function(req, res) {
	res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// route for authenticating users
apiRouter.post('/authenticate', function(req, res) {
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user) {
		if (err) res.send(err);

		if (!user) {
			res.json({success: false, message: 'Authentication failed. User not found.'});
		} else if (user) {
			// check if password matches
			if(!user.comparePassword(req.body.password)) {
				res.json({success: false, message: 'Authentication failed. Wrong Password'});
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiresInMinutes: 1440 //expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: "Enjoy your token!",
					token: token
				});
			}
		}
	});
});

// middleware to use for all requests
apiRouter.use(function(req, res, next) {
	// do logging
	console.log('Somebody just came to our app!');


	// auth coming-soon
	next();
});

// middleware to use for verifying a token
apiRouter.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, superSecret, function(err, decoded) {
			if (err) {
				return res.status(403).send({ success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token
		// return an HTTP response of 403 (access forbidden) and error message
		return res.status(403).send({ success: false, message: 'No token provided.' });
	}
});

// test route to make sure everything is working
// accessed at GET /
apiRouter.get('/', function(req, res) {
	res.json({message: 'hooray! welcome to our api'});
});

// api endpoint to get user information
apiRouter.get('/me', function(req, res) {
	res.send(req.decoded);
})

// on routes that end in /users
// ----------------------------
apiRouter.route('/users')
	// create a user: POST /api/users
	.post(function(req, res) {
		var user = new User();

		// set the users information (comes from the request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		// save the user and check for errors
		user.save(function(err) {
			if (err) {
				if (err.code == 11000) 
					return res.json({success: false, message: 'username already exists'});
				else
					return res.send(err);
			}
			res.json({message: 'User Created!'});
		});
	})
	// get all users: GET /api/users
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) res.send(err);

			// return the users
			res.json(users)
		});
	});

// on routes that end in /users/:user_id
// -------------------------------------
apiRouter.route('/users/:user_id')
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);

			// return that user
			res.json(user);
		});
	})
	// update the user with this id
	.put(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);

			// update the users info only if its new
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			// save the user
			user.save(function(err) {
				if (err) res.send(err);

				// return a message
				res.json({message: 'User updated!'});
			});
		});
	})
	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err) res.send(err);
			res.json({message: 'Successfully deleted'});
		});
	});

// Register Routes
// ===============
app.use('/api', apiRouter)

// Start the server
// ==================
app.listen(port, function() {
	console.log('Magic happens on port ' + port);
});
