'use strict';

exports.find = (req, res, next)=> {
	req.query.name = req.query.name ? req.query.name : '';
	req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
	req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
	req.query.sort = req.query.sort ? req.query.sort : '_id';

	let filters = {};
	if (req.query.username) {
		filters.username = new RegExp('^.*?' + req.query.username + '.*$', 'i');
	}

	req.app.db.models.Event.pagedFind({
		filters: filters,
		keys: 'name description username venu',
		limit: req.query.limit,
		page: req.query.page,
		sort: req.query.sort
	}, (err, results) => {

		if (err) {
			return next(err);
		}

		if (req.xhr) {
			res.header("Cache-Control", "no-cache, no-store, must-revalidate");
			results.filters = req.query;
			res.send(results);
		} else {
			results.filters = req.query;
			res.render('events/index', {data: results.data });
		}
	});
};