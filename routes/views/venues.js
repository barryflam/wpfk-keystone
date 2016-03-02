var keystone = require('keystone');
var Venue = keystone.list('Venue');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'venue';
	// locals.enquiryTypes = Venues.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'venue' }, function(next) {
		
		var newVenue = new Venue.model(),
			updater = newVenue.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: [
                'venueState',
                'name',
                'type',
                'address',
                'description',
                'rating',
                'to6M',
                'from6Mto1Y',
                'from1Yto2Y',
                'from2Yto3Y',
                'from3Yto4Y',
                'from4Yto5Y',
                'from5Yto6Y',
                'from6Yto7Y',
                'from7Yto8Y',
                'from8Yto9Y',
                'from9Yto10Y',
                'from10Yto12Y',
                'from12Y',
                'bookingRequired',
                'babyChanging',
                'childrensMenu',
                'wheelAccessible',
                'adult',
                'child',
                'infant',
                'otherDescription',
                'other'
            ].join(', '),
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.venueSubmitted = true;
			}
			next();
		});
		
	});
	
	view.render('venue');
	
};
