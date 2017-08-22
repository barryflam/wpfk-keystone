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

    var queryVenues = function (fromLatLng, radius, venueTypes, ageRanges, services, next, sortBy, searchString, page) {
        var locationSearch = fromLatLng !== null && radius !== null;

        var andFilterMatcher = locationSearch ? [{
            'geoLocation.geo': {
                $near: { 
                    $geometry: { 
                        type: 'Point',
                        coordinates: [fromLatLng.lng, fromLatLng.lat]
                    },
                    $maxDistance: milesToMeters(locals.radius)
                }
            }
        }] : (searchString.length > 0 ? [ { $text: { $search: searchString } } ] : [{ venueName: { $exists: true } }]);
 
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

        console.log(andFilterMatcher);
        
        Venue
            .model
            .find({
                $and: andFilterMatcher
            })
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

                    if (locationSearch) {
                        venues.forEach(function (venue) {
                            venue.distance = getDistanceFromLatLonInMiles(fromLatLng.lat, fromLatLng.lng, venue.geoLocation.geo[1], venue.geoLocation.geo[0]);
                        });
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
