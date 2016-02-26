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
		keys: 'name description userName venu',
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

exports.read = (req, res, next)=>{
	req.app.db.models.Event.findById(req.params.id).exec((err, event) => {
		if (err) {
			return next(err);
		}
		if (req.xhr) {
			res.send(event);
		}
		else {
			res.render('events/details', { event: event } );
		}
	});
};

exports.edit = (req, res, next)=>{
	console.log('eddit');
	req.app.db.models.Event.findById(req.params.id).exec((err, event) => {
		if (err) {
			return next(err);
		}
		if (req.xhr) {
			res.send(event);
		}
		else {
			res.render('events/edit', { event: event } );
		}
	});
};

exports.add = (req, res, next) =>{

	if(!req.isAuthenticated()){
		req.flash('error', "You are not logged in");
		res.location('/events');
		res.redirect('/events');
	}

	res.render('events/add');
};

exports.create = (req, res, next ) => {
	let workflow = req.app.utility.workflow(req, res);
	workflow.on('validate', () => {
		if (!req.body.name) {
			workflow.outcome.errors.push('Please enter a name.');
			return workflow.emit('response');
		}

		workflow.emit('createEvent');
	});

	workflow.on('createEvent', () => {
		let fieldsToSet = {
			name: req.body.name,
			description: req.body.description,
			venu: req.body.venu,
			date: req.body.date,
			startTime: req.body.startTime,
			endTime: req.body.endTime,
			userName: req.user.username,
			search: [
				req.body.name
			]
		};
		req.app.db.models.Event.create(fieldsToSet, (err, event) => {
			if (err) {
				return workflow.emit('exception', err);
			}
			console.log('Model Create');
			workflow.outcome.record = event;
			req.flash('succes', 'Event added');
			res.location('/events');
			res.redirect('/events');
		});
	});

	workflow.emit('validate');
};

exports.update = (req, res, next ) => {
	let workflow = req.app.utility.workflow(req, res);
	workflow.on('validate', () => {
		if (!req.body.name) {
			workflow.outcome.errors.push('Please enter a name.');
			return workflow.emit('response');
		}

		workflow.emit('updateEvent');
	});

	workflow.on('updateEvent', () => {
		let fieldsToSet = {
			name: req.body.name,
			description: req.body.description,
			venu: req.body.venu,
			date: req.body.date,
			startTime: req.body.startTime,
			endTime: req.body.endTime,
			userName: req.user.username,
			search: [
				req.body.name
			]
		};
		req.app.db.models.Event.findByIdAndUpdate(req.params.id, fieldsToSet, (err, event) => {
			if (err) {
				return workflow.emit('exception', err);
			}
			console.log('Model Create');
			workflow.outcome.record = event;
			req.flash('succes', 'Event Updated');
			res.location('/events/show/'+req.params.id);
			res.redirect('/events/show/'+req.params.id);
		});
	});

	workflow.emit('validate');
};

exports.delete = (req, res, next ) => {
	let workflow = req.app.utility.workflow(req, res);
	workflow.on('validate', function() {
		workflow.emit('deleteEvent');
	});

	workflow.on('deleteEvent', () => {
		let fieldsToSet = {
			name: req.body.name,
			description: req.body.description,
			venu: req.body.venu,
			date: req.body.date,
			startTime: req.body.startTime,
			endTime: req.body.endTime,
			userName: req.user.username,
			search: [
				req.body.name
			]
		};
		req.app.db.models.Event.findByIdAndRemove(req.params.id, fieldsToSet, (err, event) => {
			if (err) {
				return workflow.emit('exception', err);
			}
			console.log('Model Create');
			workflow.outcome.record = event;
			req.flash('succes', 'Event Removed');
		});
	});

	workflow.emit('validate');
};