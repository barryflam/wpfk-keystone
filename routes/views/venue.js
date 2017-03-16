var keystone = require('keystone');
var Venue = keystone.list('Venue'),
    Review = keystone.list('Review');

exports = module.exports = function(req, res) {
    var venueSlug = req.params.slug;
	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.mainSite = true;

    view.on('get', function(next) {
        Venue.model.findOne({ 'slug': venueSlug }, '', function (err, venue) {
            locals.venue = venue;

            Review.model.find({ 'venueSlug': venueSlug }, '', function (err, reviews) {
                locals.reviews = reviews;
                locals.reviewCount = reviews.length;
                next(err);
            });
        });
    });
	
	view.render('venue');
};
