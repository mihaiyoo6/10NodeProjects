"use strict";
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
let	db = mongoose.connection;

//user schema
let UserSchema = mongoose.Schema({
	userName: {
		type: String,
		inedx: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileImage: {
		type: String
	}
});

let User = module.exports = mongoose.model('User', UserSchema );

module.exports.createUser = (newUser, callback)=>{
	newUser.save(callback);
}