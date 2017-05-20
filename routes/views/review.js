var keystone = require('keystone');
var Review = keystone.list('Review');
var Venue = keystone.list('Venue');

exports = module.exports = function(req, res) {
	
/*	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.mainSite = true;
	
	// Set locals
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false; 
	
    var newReview = new Review.model(),
        updater = newReview.getUpdateHandler(req),
        venueSlug = req.body.venueSlug;
    
    updater.process(req.body, {
        flashErrors: true,
        fields: [
            'yourName',
            'email',
            'children.child1Name',
            'children.child1Age',
            'children.child2Name',
            'children.child2Age',
            'children.child3Name',
            'children.child3Age',
            'children.child4Name',
            'children.child4Age',
            'children.child5Name',
            'children.child5Age',
            'rating',
            'description',
            'ipAddress',
            'venueId',
            'venueSlug',
            'addedOn'
        ].join(', '),
        errorMessage: 'There was a problem submitting your review:'
    }, function(err) {            
        if (err) {
            req.flash('error', { detail: 'Review error, please try again later.' });                        
        }
        else {
            req.flash('success', { detail: 'Thanks for sending your review!' });        
        }
        res.redirect('/venue/' + venueSlug);
    });*/
};
