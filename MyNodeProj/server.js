/**
 * http://usejsdoc.org/
 */

//Express is a routing and middleware web framework that has minimal functionality of its own: 
//An Express application is essentially a series of middleware function calls.
var express = require('express');

var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');

mongoose.connect(config.database, function(err) {
	if(err){
		console.log(err);
	}else{
		console.log("Connect to mongoDB here");
	}		
})

var app = express(); //route
//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//the following line have to be here
//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
//app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app, express);
app.use('/api', api);   // /api is the prefix of the url  8081/api/signup


//make all file under this directory render with css, 
//To serve static files such as images, CSS files, 
//and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(__dirname + '/public'));


app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/app/views/index.html');
});

//////////////////
// test
console.log("First");
setImmediate(function(){
//setTimeout(function(){
	console.log("Second");
});
console.log("third");
/////////////////

app.listen(config.port, function(err){
	if(err){
		console.log(err);
	}else{
		console.log("listening on port 3000");
	}
	
});