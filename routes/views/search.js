var keystone = require('keystone');
var Venue = keystone.list('Venue');
var https = require('https');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.mainSite = true;
    locals.pageTitle = "Search for a Wiki Place";

    view.on('get', function(next) {
        locals.vicinity = req.query.vicinity;
        locals.searchString = req.query.searchString || '';
        locals.radius = req.query.radius;
        locals.page = req.query.page || 1;

        locals.venueType = {};

        switch (req.query.sortBy) {
            case "popularity":
                locals.sortByPopularity = true;
                break;
            case "added":
                locals.sortByAdded = true;
                break;
            case "open-today":
                locals.sortByOpenToday = true;
                break;
            case "nearest": 
            default:
                locals.sortByNearest = true;
        }

        var venueTypes = req.query.venueTypes || [];

        if (typeof venueTypes !== "object") {
            var venueTypes = [ req.query.venueTypes ];
        }

        venueTypes.forEach(function(type) {
            locals.filterActivityType = true;
            locals.venueType[type] = true;
        });

        locals.ageRange = {};

        var ageRanges = req.query.ageRanges || [];

        if (typeof ageRanges !== "object") {
            var ageRanges = [ req.query.ageRanges ];
        }

        ageRanges.forEach(function(range) {
            locals.filterAgeRanges = true;
            locals.ageRange[range] = true;
        });

        locals.services = {};

        var services = req.query.services || [];

        if (typeof services !== "object") {
            var services = [ req.query.services ];
        }

        services.forEach(function(range) {
            locals.filterServices = true;
            locals.services[range] = true;
        });

        var hasSearchString = locals.searchString !== '';

        if (hasSearchString) {
            locals.filterSearchString = true;
        }

        var hasVicinity = locals.vicinity && locals.vicinity.length > 0;

        if(hasVicinity) {
            locals.filterLocation = true;
        }

        var searchQuery = hasVicinity ? locals.vicinity : '';
        searchQuery += hasSearchString ? (hasVicinity ? ' and ' + locals.searchString : locals.searchString) : '';

        locals.searchQuery = searchQuery;

        next()
    });
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'search';
	
	// Render the view
	view.render('search');
};
