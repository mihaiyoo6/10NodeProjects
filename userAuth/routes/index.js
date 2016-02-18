const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenicated, (req, res, next) => {

	res.render('index', {title: 'Members'});
});

function ensureAuthenicated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('info', 'You must login!');
		res.redirect('/users/login');
	}
}

module.exports = router;
