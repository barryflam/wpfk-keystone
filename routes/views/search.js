var keystone = require('keystone');
var Venue = keystone.list('Venue');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

    view.on('get', function(next) {
        Venue.paginate({
            page: req.query.page || 1,
            perPage: 50
        })
        .sort('-publishedDate')
        .exec(function(err, results) {
            locals.venues = results;
            next(err);
        });
    });
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'search';
	
	// Render the view
	view.render('search');
};