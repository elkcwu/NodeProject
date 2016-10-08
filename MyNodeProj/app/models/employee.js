/**
 * http://usejsdoc.org/
 */
// these are model

var mongoose = require('mongoose');

var bcrypt =require('bcrypt-nodejs');  //safe way to store user password

var Schema = mongoose.Schema;

var employeeSchema = new Schema({
	
	empName : String,
	empLast : String,
	SSN : {type: String, required: true, index: {unique: true}},
	DOB : {type: Date},
	createDate : {type: Date, default: Date.now},
	createor: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Employee', employeeSchema);