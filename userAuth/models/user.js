'use strict'
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');

const db = mongoose.connection;

// User Schema
let UserSchema = mongoose.Schema({
    userName: {
        type: String,
        index: true
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
    profileimage: {
        type: String
    }

});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = (candidatePassowrd, hash, callback)=>{
    bcrypt.compare(candidatePassowrd, hash,(err, isMatch)=>{
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserById = (id, callback)=>{
    User.findById(id, callback);
}

module.exports.getUserByUserName = (userName, callback)=>{
	console.log('getUserByUserName');
    let query = {userName: userName};
    User.findOne(query, callback);
}

module.exports.createUser = (newUser,callback)=>{
    bcrypt.hash(newUser.password, 10, (err, hash) => {
        if(err) throw err;

        // Set Hashed password
        newUser.password = hash;

        // Create User
        newUser.save(callback);
    });
};
