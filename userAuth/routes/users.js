'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

/* GET users listing. */
router.get('/', (req, res, next)=> {
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

router.post('/register', (req, res, next)=> {
    let name = req.body.name;
    let email = req.body.email;
    let userName = req.body.userName;
    let password = req.body.password;
    let password2 =  req.body.password2;


    // Check for Image Field
    if(req.files.profileimage){
        console.log('uploading File...');

        // File Info
        let profileImageOriginalName = req.files.profileimage.originalname;
        let profileImageName = req.files.profileimage.name;

        let profileImageMime = req.files.profileimage.mimetype;
        let profileImagePath = req.files.profileimage.path;
        let profileImageExt = req.files.profileimage.extension;
        let profileImageSize = req.files.profileimage.size;
    } else {
        // Set a Default Image
        let profileImageName = 'noimage.png';
    }

    // Form Validation

    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email not valid').isEmail();
    req.checkBody('userName','UserName field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);

    // Check for errors
    let errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            userName: userName,
            password: password,
            password2: password2
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            userName: userName,
            password: password,
            profileImage: profileImageName
        });

            // Create User
            User.createUser(newUser, (err, user)=>{
                if(err)throw err;
                console.log(user);
            });

            //Success Message
            req.flash('success', 'You are noew registered and may log in');

            res.location('/');
            res.redirect('/');
    }
});

passport.serializeUser((user, done)=> {
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  User.getUserById(id, (err, user)=> {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    (userName, password, done)=>{
    	console.log('localStrategy');
        User.getUserByUserName(userName, (err, user)=>{
            if(err) throw err;
            if(!user){
                console.log('Unknown User');
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));

router.post('/login', passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'Invalid userName or password'}), (req, res)=>{
    console.log('Authentication Successful');
    req.flash('success', 'You are logged in');
    res.redirect('/');
});

router.get('/logout', (req, res)=>{
	if(req.isAuthenticated()){
    	req.logout();
	    req.flash('success', 'You have logged out');
	}else{
		req.flash('info', 'No person logged.');
	}
    res.redirect('/users/login');
});

module.exports = router;
