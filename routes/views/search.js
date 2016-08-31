var keystone = require('keystone');
var Venue = keystone.list('Venue');
var https = require('https');

exports = module.exports = function(req, res) {
    var googleApiKey = process.env.GOOGLE_SERVER_API_KEY;

	var view = new keystone.View(req, res);
	var locals = res.locals;
    locals.mainSite = true;

    var milesToMeters = function(miles) {
        return (miles / 0.62137) * 1000;
    }

    function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return kmToMiles(d);
    }

    function kmToMiles(km) {
        return (km * 0.62137).toFixed(2);
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
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
        var andFilterMatcher = fromLatLng !== null && radius !== null ? [{
            'geoLocation.geo': {
                $near: { 
                    $geometry: { 
                        type: 'Point',
                        coordinates: [fromLatLng.lng, fromLatLng.lat]
                    },
                    $maxDistance: milesToMeters(locals.radius)
                }
            }
        }] : [];

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
                if (venues) {
                    locals.venueCount = venues.length;
                    venues.forEach(function (venue) {
                        venue.distance = getDistanceFromLatLonInMiles(fromLatLng.lat, fromLatLng.lng, venue.geoLocation.geo[1], venue.geoLocation.geo[0]);
                    });
                } else {
                    locals.venueCount = 0;
                }

                locals.venues = venues;

                console.log(venues);
                
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
            locals.filterActivityType = true;
            console.log(type);
            locals.venueType[type] = true;
        });

        locals.ageRange = {};

        var ageRanges = req.query.ageRanges || [];

        if (typeof ageRanges !== "object") {
            var ageRanges = [ req.query.ageRanges ];
        }

        ageRanges.forEach(function(range) {
            locals.filterAgeRanges = true;
            console.log(range);
            locals.ageRange[range] = true;
        });

        if(locals.vicinity && locals.vicinity.length > 0) {
            locals.filterLocation = true;
            doGeocode(req.query.vicinity, function (geocodeResponse) {
                if (geocodeResponse.lat && geocodeResponse.lng) {
                    queryVenues(geocodeResponse, req.query.radius, venueTypes, ageRanges, next);
                } else {
                    next(geocodeResponse);
                }
            });
        } else {
            queryVenues(null, null, venueTypes, ageRanges, next);
        }
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