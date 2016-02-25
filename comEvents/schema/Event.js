'use strict';

//noinspection JSUnresolvedVariable
exports = module.exports = (app, mongosse) => {
	let eventSchema = new mongosse.Schema({
		name: {type: String, required: true},
		description: {type: String},
		venu: {type: String},
		date: {type: Date},
		startTime: {type: String},
		endTime: {type: String},
		userName: {type: String, required: true},
		search: [ String ]
	});

	eventSchema.plugin(require('./plugins/pagedFind'));
	eventSchema.index({name: 1});
	eventSchema.index({venu: 1});
	eventSchema.index({data: 1});
	eventSchema.index({userName: 1});
	eventSchema.index({startTime: 1});
	eventSchema.index({endTime: 1});
	eventSchema.index({serch: 1});

	eventSchema.set('autoIndex', (app.get('env') === 'development'));
	app.db.model('Event', eventSchema);
}