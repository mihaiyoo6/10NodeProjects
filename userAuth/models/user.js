"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/nodeauth');
let	db = mongoose.connection;

//user schema
let UserSchema = mongoose.Schema({
	userName: {
		type: String,
		inedx: true
	},
	password: {
		type: String,
		required: true,
		bcrypt: true
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
	bcrypt.hash(newUser.password, 10, (err, hash)=>{
		if(err) throw error;
		newUser.password = hash
		newUser.save(callback);
	});
}