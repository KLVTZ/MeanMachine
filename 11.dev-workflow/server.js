var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;

// configure public assets folder
app.use(express.static(__dirname + '/public'));

// route to send index.html
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// start the server
app.listen(port, function() {
	console.log('Magic happens on %d', port);
});

