'use strict';
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

/* home page blog posts . */
router.get('/', (req, res, next) => {
	let db = req.db;
	let posts = db.get('posts');
	posts.find({},{}, (err, posts) => {
		res.render('index',{
			posts
		});
	});
});

module.exports = router;
