'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', (req, res, next) => {
	res.send('respond with a resource');
});

router.get('/register', (req, res, next)=> {
	res.render('register', {
		'title': 'Register'
	});
});

router.get('/login', (req, res, next)=> {
	res.render('login', {
		'title': 'Login'
	});
});

router.post('/register', (req, res, next)=>{
	let name = req.body.name,
		userName = req.body.userName,
		email = req.body.email,
		password = req.body.password,
		confirmPassword = req.body.confirmPassword,
		profileImageName = 'noImage.png';

	//check for profile image
	if(req.files.profileImage){
		console.log('uploading image');
		let profileImageOriginalName = req.files.profileImage.originalName,
			profileImageMime = req.files.profileImage.mimeType,
			profileImagePath = req.files.profileImage.path,
			profileImageExtension = req.files.profileImage.extenstion,
			profileImageSize = req.files.profileImage.size;
		profileImageName = req.files.profileImage.name;
	}

	//form validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('userName','userName field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('password','Password field is required').notEmpty();
	req.checkBody('confirmPassword','Passwords don\'t match').equals(password);

	let errors = req.validationErrors();
	if(errors){
		console.log(errors);
		res.render('register',{
			errors,
			name,
			email,
			password,
			confirmPassword
		});
	}else{
		let newUser = new User({
			name,
			email,
			password,
			profileImage: profileImageName
		});

		User.createUser(newUser, (err, user)=>{
			if(err){
				throw err;
			}
			console.log(user);

		});

	}
});



module.exports = router;
