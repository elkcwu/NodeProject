/**
 * http://usejsdoc.org/
 */

var mongoose = require('mongoose');
var bcrypt =require('bcrypt-nodejs');  //safe way to store user password
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	
	name: String,
	username: {type: String, required: true, index: {unique: true}},
	password: {type: String, required: true, select: false}
});

UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password'))
		return next();
	//hash and encrypt sensitive date before storing them in database
	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err)
			next(err);
		user.password = hash;
		next();
	});
});

//custom instance method
UserSchema.methods.comparePassword = function(password){
	
	var user = this;
	return bcrypt.compareSync(password, user.password)
}


module.exports = mongoose.model('User', UserSchema)