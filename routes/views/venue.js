var keystone = require('keystone');
var Venue = keystone.list('Venue');

exports = module.exports = function(req, res) {
    var venueSlug = req.params.slug;
	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.mainSite = true;

    view.on('get', function(next) {
        Venue.model.findOne({ 'slug': venueSlug }, '', function (err, venue) {
            console.log(venue);
            locals.venue = venue;
            next(err);
        })
    });
	
	view.render('venue');
};
