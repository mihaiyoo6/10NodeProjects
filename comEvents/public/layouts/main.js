$( document ).ready(function() {
	'use strict';
	$('.event-detele').on( "click", function(e) {

		e.preventDefault();
		var eventId = e.target.getAttribute('data-event-id');
		console.log(eventId);
		$.ajax({
			url: '/events/delete/'+ eventId,
			type: 'DELETE',
			success: function(result) {

			}
		});
		window.location = '/events';
	});
});