var keystone = require('keystone');
var Venue = keystone.list('Venue');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'recommend';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'recommend' }, function(next) {
        
        console.log(req);
		
		var newVenue = new Venue.model(),
			updater = newVenue.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: [
                'venueState',
                'venueName',
                'venueType.softplay',
                'venueType.indoorActivities',
                'venueType.outdoorActivities',                
                'venueType.food',
                'venueType.pubs',
                'venueType.hotels',
                'venueType.groups',
                'venueType.classes',
                'venueType.swimming',
                'venueType.outdoors',
                'venueType.animals',
                'venueType.culture',
                'venueType.libraries',
                'venueType.sports',
                'address',
                'website',
                'telephoneNumber',
                'description',
                'rating',
                'suitableForAges.to6M',
                'suitableForAges.from6Mto1Y',
                'suitableForAges.from1Yto2Y',
                'suitableForAges.from2Yto3Y',
                'suitableForAges.from3Yto4Y',
                'suitableForAges.from4Yto5Y',
                'suitableForAges.from5Yto6Y',
                'suitableForAges.from6Yto7Y',
                'suitableForAges.from7Yto8Y',
                'suitableForAges.from8Yto9Y',
                'suitableForAges.from9Yto10Y',
                'suitableForAges.from10Yto12Y',
                'suitableForAges.from12Y',
                'bookingRequired',
                'services.babyChanging',
                'services.childrensMenu',
                'services.wheelAccessible',
                'services.suitableForMany',
                'services.doublePramFriendly',  
                'services.goodFood',                                              
                'prices.adult',
                'prices.child',
                'prices.infant',
                'prices.otherDescription',
                'openingHours.monday.isOpen',
                'openingHours.monday.open.from',
                'openingHours.monday.open.to',
                'openingHours.tuesday.isOpen',
                'openingHours.tuesday.open.from',
                'openingHours.tuesday.open.to',
                'openingHours.wednesday.isOpen',
                'openingHours.wednesday.open.from',
                'openingHours.wednesday.open.to',
                'openingHours.thursday.isOpen',
                'openingHours.thursday.open.from',
                'openingHours.thursday.open.to',
                'openingHours.friday.isOpen',
                'openingHours.friday.open.from',
                'openingHours.friday.open.to',
                'openingHours.saturday.isOpen',
                'openingHours.saturday.open.from',
                'openingHours.saturday.open.to',
                'openingHours.sunday.isOpen',
                'openingHours.sunday.open.from',
                'openingHours.sunday.open.to',
                'image',
                'user.yourName',
                'user.childName',
                'user.childAge',
                'user.email',
		        'user.agreement'
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
	
	view.render('recommend');
	
};
