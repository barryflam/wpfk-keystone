var keystone = require('keystone');
var Venue = keystone.list('Venue');
var https = require('https');

exports = module.exports = function(req, res) {
    var googleApiKey = process.env.GOOGLE_SERVER_API_KEY;

	var view = new keystone.View(req, res);
	var locals = res.locals;

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

    var queryVenues = function (fromLatLng, radius, venueTypes, ageRanges, next) {
        var andFilterMatcher = [{
            'geoLocation.geo': {
                $near: { 
                    $geometry: { 
                        type: 'Point',
                        coordinates: [fromLatLng.lng, fromLatLng.lat]
                    },
                    $maxDistance: milesToMeters(locals.radius)
                }
            }
        }];

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

        console.log(andFilterMatcher);
        
        Venue
            .model
            .find({
                $and: andFilterMatcher
            })
            .limit(50)
            .exec(function(err, venues) {
                locals.venues = venues;

                if (venues) {
                    locals.venueCount = venues.length;
                } else {
                    locals.venueCount = 0;
                }
                
                next(err);
            });
    }

    view.on('get', function(next) {
        locals.vicinity = req.query.vicinity;
        
        locals.radius = req.query.radius;

        locals.venueType = {};

        var venueTypes = req.query.venueTypes || [];

        if (typeof venueTypes !== "object") {
            var venueTypes = [ req.query.venueTypes ];
        }

        venueTypes.forEach(function(type) {
            console.log(type);
            locals.venueType[type] = true;
        });

        locals.ageRange = {};

        var ageRanges = req.query.ageRanges || [];

        if (typeof ageRanges !== "object") {
            var ageRanges = [ req.query.ageRanges ];
        }

        ageRanges.forEach(function(range) {
            console.log(range);
            locals.ageRange[range] = true;
        });

        doGeocode(req.query.vicinity, function (geocodeResponse) {
            if (geocodeResponse.lat && geocodeResponse.lng) {
                queryVenues(geocodeResponse, req.query.radius, venueTypes, ageRanges, next);
            } else {
                next(geocodeResponse);
            }
        });
    });

    /*view.on('post', function(next) {
        Venue.paginate({
            page: req.query.page || 1,
            perPage: 25
        })
        .sort('-publishedDate')
        .exec(function(err, results) {
            locals.venues = results;
            next(err);
        });
    });*/
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'search';
	
	// Render the view
	view.render('search');
};