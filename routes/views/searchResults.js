var keystone = require('keystone');
var Venue = keystone.list('Venue');
var https = require('https');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res);
	var locals = res.locals;
    var googleApiKey = process.env.GOOGLE_SERVER_API_KEY;

    var milesToMeters = function(miles) {
        return (miles / 0.62137) * 1000;
    }

    var doGeocode = function(address, callback) {
        https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + googleApiKey, (apiRes) => {
            // consume response body
            apiRes.setEncoding('utf8');
            var body = "";
  
            apiRes.on('data', function (data) {
                if (data !== undefined) {
                    body += data;
                }
            });

            apiRes.on('end', function () {
                var jsonData = JSON.parse(body);

                if(jsonData.results.length > 0) {
                    var searchFrom = jsonData.results[0].geometry.location;

                    callback(searchFrom);
                } else {
                    callback("Error for Google Maps API", jsonData.status)
                }
            });
        }).on('error', function (e) {
            console.log('Got error: ' + e.message);
            callback(e.message);
        });;
    }

    var queryVenues = function (fromLatLng, radius, venueTypes, ageRanges, services, next, sortBy, searchString, page) {
        var locationSearch = fromLatLng !== null && radius !== null,
            andFilterMatcher = [ { _id: { $exists: true } }, { slug: { $exists: true } } ],
            query = null;

        venueTypes.forEach(function(type) {
            var emptyObj = {};
            emptyObj['venueType.' + type] = true;
            andFilterMatcher.push( emptyObj );
        });

        ageRanges.forEach(function(ranges) {
            var emptyObj = {};
            emptyObj['suitableForAges.' + ranges] = true;
            andFilterMatcher.push( emptyObj );
        });

        services.forEach(function(ranges) {
            var emptyObj = {};
            emptyObj['services.' + ranges] = true;
            andFilterMatcher.push( emptyObj );
        });

        if (locationSearch) {
            sortBy["distance"] = 1;

            query = Venue.model.aggregate({
                $geoNear: {
                    near: { type: "Point", coordinates: [fromLatLng.lng, fromLatLng.lat] },
                    distanceField: "distance",
                    maxDistance: milesToMeters(locals.radius),
                    distanceMultiplier: 0.00062137,
                    query: { $and: andFilterMatcher },
                    spherical: true
                }
            });
        } else {
            if(searchString.length > 0) {
                andFilterMatcher.push({ $text: { $search: searchString } });
            } else {
                andFilterMatcher.push({ venueName: { $exists: true } });
            }

            query = Venue.model.find({ $and: andFilterMatcher });
        }

        query
        .sort(sortBy)
        .exec(function(err, venues) {
            if (venues) {
                if (searchString !== '') {
                        var regex = new RegExp('\\b' + searchString + '\\b', 'i');

                        venues = venues.filter(function (venue) { 
                            var string = (venue.venueName + ' ' + venue.address + ' ' + venue.description);
                            return regex.test(string);
                        });
                    }

                    locals.venueCount = venues.length;

                    var maxIndex = (page * 20);

                    venues = venues.slice(maxIndex - 20, maxIndex)

                    if (maxIndex >= locals.venueCount) {
                        locals.hasNext = "no";
                    } else {
                        locals.hasNext = "yes";
                    }
                } else {
                    locals.venueCount = 0;
                }

                locals.venues = venues;
                
                next(err);
            });
    }

    view.on('post', function(next) {
        locals.vicinity = req.body.vicinity;
        locals.searchString = req.body.searchString || '';
        locals.radius = req.body.radius;
        locals.page = req.body.page || 1;

        locals.venueType = {};

        var sortBy = {
            "isPremiumListing": -1
        };

        switch (req.body.sortBy) {
            case "popularity":
                locals.sortByPopularity = true;
                sortBy["rating"] = -1;
                break;
            case "added":
                locals.sortByAdded = true;
                sortBy["addedOn"] = -1;
                break;
            case "open-today":
                locals.sortByOpenToday = true;
                sortBy["openToday"] = -1;
                break;
            case "nearest": 
            default:
                locals.sortByNearest = true;
        }

        var venueTypes = req.body.venueTypes || [];

        if (typeof venueTypes !== "object") {
            var venueTypes = [ req.body.venueTypes ];
        }

        venueTypes.forEach(function(type) {
            locals.filterActivityType = true;
            locals.venueType[type] = true;
        });

        locals.ageRange = {};

        var ageRanges = req.body.ageRanges || [];

        if (typeof ageRanges !== "object") {
            var ageRanges = [ req.body.ageRanges ];
        }

        ageRanges.forEach(function(range) {
            locals.filterAgeRanges = true;
            locals.ageRange[range] = true;
        });

        locals.services = {};

        var services = req.body.services || [];

        if (typeof services !== "object") {
            var services = [ req.body.services ];
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
            doGeocode(req.body.vicinity, function (geocodeResponse) {
                if (geocodeResponse.lat && geocodeResponse.lng) {
                    queryVenues(geocodeResponse, req.body.radius, venueTypes, ageRanges, services, next, sortBy, locals.searchString, locals.page);
                } else {
                    next(geocodeResponse);
                }
            });
        } else {
            queryVenues(null, null, venueTypes, ageRanges, services, next, sortBy, locals.searchString, locals.page);
        }

        var searchQuery = hasVicinity ? locals.vicinity : '';
        searchQuery += hasSearchString ? (hasVicinity ? ' and ' + locals.searchString : locals.searchString) : '';

        locals.searchQuery = searchQuery;
    });
	
	// Render the view
	view.render('partials/search-results', {layout: ''});
};
