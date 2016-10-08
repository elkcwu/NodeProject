/**
 * http://usejsdoc.org/
 */

var User = require('../models/user');
var Empl = require('../models/employee')
var Story = require('../models/story');
var config = require('../../config.js');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');


function createToken(user){
	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresIn: 1440
	});
	return token;
}



//these are the controllers
module.exports = function(app, express){
	var api = express.Router(); // create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, 
	//                          it is often referred to as a “mini-app”.
	api.post('/signup', function(req, res){  ///signup is part of the url path like api/signup
		var user = new User({
			name: req.body.name,  //body is body-parser liberary
			username: req.body.username,
			password: req.body.password
		});
		
		user.save(function(err){
			if(err){
				res.send(err);
				return;
			}
			
			res.json({message: 'User has been created!'});
		});
	});
	
	/// I add this
	api.post('/addEmp', function(req, res){
		var empl = new Employee({
			empName : String,
			empLast : String,
			SSN : {type: String, required: true, index: {unique: true}},
			DOB : {type: Date},
			createDate : {type: Date, default: Date.now},
			createor: {type: Schema.Types.ObjectId, ref: 'User'}
			
		})
	})
	
	
	api.get('/users', function(req, res){
		User.find({}, function(err, users){  //find is mongoose Scheme function, find = get all
			if(err){
				res.send(err);
				retrun;
			}
			res.json(users);
		});
		
	});
		
	api.post('/login', function(req,res){
		console.log(req.headers);	
		
		User.findOne({
			username: req.body.username
		}).select('password').exec(function(err,user){
			if(err) 
				res.send({message: err});
			if(!user){
				res.send({message: " user Doesnt exist"});
				
			}else if(user){
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
						res.send({message: "Invalid Password"});
				}else {
					//token authentic
					var token = createToken(user);
					res.json({
						success: true,
						message: "Successfully login!",
						token: token
					});
					
					
				}
			}
		});
	})
	
		//middleware
	api.use(function(req, res, next){
		console.log("Somebody just came to our app!");
		console.log("Here is the Header item kevinwu: " + req.headers.kevinwu);
		
		var token = req.body.token || req.param('token') || req.headers['x-token-header'];
		if(token){
			jsonwebtoken.verify(token, secretKey, function(err, decoded){
				if(err){
					res.status(403).send({success: false, message: "Failed to authenticate user"});
				}else{ // get token
					req.decoded = decoded;
					next();
				}
			});
			
		}else{
			res.status(403).send({suceess: false, message: "No Token Provided"})
		}
	});
	
//	api.get('/', function(req, res){
//		res.json("Hello World!");
//	})
	
	//chainable route handlers for route path 
	api.route('/')
		.post(function(req, res){
			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content,
			});
	
		 story.save(function(err){
			 if(err){
				 res.send(err);
				 return
			 }
			 res.json({ message : "New Story Created!"});
		 });
		})  //no ; here 
	
	
	  .get(function(req, res){
		  Story.find({
			  creator: req.decoded.id  // look at this: req.decoded = decoded; above
		  }, function(err, stories){
			  if(err){
				  res.send(err);
				  return;
			  }
			  res.json(stories);
		  });
	  });
	
	
	api.get('/me', function(req, res){
		res.json(req.decoded);		
	});
	
	return api;
}