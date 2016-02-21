'use strict';
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

router.get('/add', (req, res, next) => {
	res.render('addcategory', {
		'title': 'Add Category'
	});
});

router.get('/show/:cateogry',(req, res, next) => {
	let db  = req.db,
		posts = db.get('posts');
	console.log(req.params.cateogry);
	posts.find({category: req.params.cateogry},{},(err, posts)=>{
		if(err){
			cosnole.log('failed to fetch posts from category ', req.params.category);
		}
		res.render('index',{
			'title': req.params.category,
			'posts': posts
		});
	});

});

router.post('/add', (req, res, next) => {
	//get from values
	let title = req.body.title;

	//form variables
	req.checkBody('title', 'Title field is required').notEmpty();

	//check errors

	let errors = req.validationErrors();
	if(errors){
		res.render('adcategory', {
			'errors': errors,
			'title': title,
			'body': body
		});
	}else{
		let categories = db.get('categories');
		//submit to db
		categories.insert({
			'title': title
		},(err, post) => {
			if(err){
				res.send('There was an issue submitting the category!');
			}else{
				req.flash('success', 'Category Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;