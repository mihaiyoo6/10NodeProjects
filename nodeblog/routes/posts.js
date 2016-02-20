'use strict';
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

router.get('/add', (req, res, next) => {
	//get Cateories
	let categories = db.get('categories');
	categories.find({},{},(err, categories) => {
		console.log(categories);
		if(err){

		}else{
			res.render('addpost',{
				'title': 'Addpost',
				'categories': categories
			});
		}
	});

});

router.post('/add', (req, res, next) => {
	//get from values
	let title = req.body.title,
		category = req.body.category,
		body = req.body.body,
		author = req.body.author,
		date = new Date(),
		mainImage = {};

	if(req.files.mainimage){
		mainImage ={
			originalName: req.files.mainImage.originalName,
			name : req.files.mainImage.name,
			mine : req.files.mainImage.minetype,
			path : req.files.mainImage.path,
			ext : req.files.mainImage.extension,
			size : req.files.mainImage.size
		};
	}else{
		mainImage.name = 'noImage.png';
	}

	//form variables
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('body', 'body field is required').notEmpty();

	//check errors

	let errors = req.validationErrors();
	if(errors){
		res.render('addpost', {
			'errors': errors,
			'title': title,
			'body': body
		});
	}else{
		let posts = db.get('posts');
		//submit to db
		posts.insert({
			'title': title,
			'body': body,
			'category': category,
			'date': date,
			'author': author,
			'mainImage': mainImage.name
		},(err, post) => {
			if(err){
				res.send('There was an issue submitting the post!');
			}else{
				req.flash('success', 'Post Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;