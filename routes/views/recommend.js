var keystone = require('keystone');
var Venue = keystone.list('Venue');
var Page = keystone.list('Page');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.mainSite = true;
 
    var recommendSlug = "recommend",
        thankYouSlug = "thank-you";

    view.on('get', function(next) {
        Page.model.findOne({ 'slug': recommendSlug }, '', function (err, page) {
            if (page) {
                locals.title = page.title;
                locals.content = page.content;       
            } else {
                locals.title = "Page not found";
                res.status(404);
            }

            next(err);
        });
    });
	
	// Set locals
	locals.section = 'recommend';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false; 
    
    // Read user data from session
    if(req.session.user)
    {
        locals.formData["user.yourName"] = req.session.user.yourName ? req.session.user.yourName : "";
        locals.formData["user.email"] = req.session.user.email ? req.session.user.email : "";
        locals.formData["user.childName"] = req.session.user.childName ? req.session.user.childName : "";
        locals.formData["user.childAge"] = req.session.user.childAge ? req.session.user.childAge : "";   
    } 
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'recommend' }, function(next) {
        locals.formData = req.body || {};
        
		var newVenue = new Venue.model(),
			updater = newVenue.getUpdateHandler(req);

        var geoLocationField = [req.body.lng, req.body.lat];
        req.body.geoLocation = {
            geo: geoLocationField 
        };
		
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
                'services.kidsParties',                                           
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
		        'user.agreement',
		        'placeId',
                'lat',
                'lng',
                'geoLocation'
            ].join(', '),
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
            console.log(locals.formData["user.yourName"]);
            
			if (err) {
				locals.validationErrors = err.errors;

                Page.model.findOne({ 'slug': recommendSlug }, '', function (err, page) {
                    if (page) {
                        locals.title = page.title;
                        locals.content = page.content;       
                    } else {
                        locals.title = "Page not found";
                        res.status(404);
                    }

                    next(err);
                });
			} else {
                req.session.user = {};
                req.session.user.yourName = locals.formData["user.yourName"];
                req.session.user.email = locals.formData["user.email"];
                req.session.user.childName = locals.formData["user.childName"];
                req.session.user.childAge = locals.formData["user.childAge"];
				locals.venueSubmitted = true;

                Page.model.findOne({ 'slug': thankYouSlug }, '', function (err, page) {
                    if (page) {
                        locals.title = page.title;
                        locals.content = page.content;       
                    } else {
                        locals.title = "Page not found";
                        res.status(404);
                    }

                    next();
                });
			}
		});
		
	});
	
	view.render('recommend');
};