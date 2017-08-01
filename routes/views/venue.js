var keystone = require('keystone');
var Venue = keystone.list('Venue'),
    Review = keystone.list('Review');

exports = module.exports = function(req, res) {
    var venueSlug = req.params.slug;
    var view = new keystone.View(req, res);
    var renderer = view.render;
	var locals = res.locals;
    locals.mainSite = true;

    view.on('get', function(next) {
        Venue.model.findOne({ 'slug': venueSlug }, '', function (err, venue) {
            locals.venue = venue;
            locals.pageTitle = venue.venueName;

            Review.model.find()
                .where({ 'venueSlug': venueSlug })
                .sort({addedOn: -1})
                .exec(function (err, reviews) {
                    locals.reviews = reviews;
                    locals.reviewSpotlight = reviews[0];
                    locals.reviewCount = reviews.length;
                    next(err);
                });
        });
    });

    view.render(function(err, request, response) {
        var templateName;

        if (res.locals.venue.isPremiumListing)
        {
            templateName = "premium-venue";
            res.locals.carousel = true;
        }
        else
        {
            templateName = "venue";
            res.locals.carousel = false;
        }

        view.res.render(templateName, res.locals, null);
    });
};
