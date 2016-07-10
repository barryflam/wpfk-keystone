var keystone = require('keystone');
var Venue = keystone.list('Venue');
var https = require('https');

exports = module.exports = function(req, res) {
    var googleApiKey = process.env.GOOGLE_SERVER_API_KEY;

	var view = new keystone.View(req, res);
	var locals = res.locals;

    var doGeocode = function(address, next) {
        https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + googleApiKey, (apiRes) => {
            // consume response body
            apiRes.setEncoding('utf8');
            var body = "";
  
            apiRes.on('data', function (data) {
                console.log('Data received: ', data);
                if (data !== undefined) {
                    body += data;
                }
            });

            apiRes.on('end', function () {
                console.log('Request end');
                var jsonData = JSON.parse(body);

                if(jsonData.results.length > 1) {
                    var searchFrom = jsonData.results[0].geometry.location;
                    
                    Venue.model
                        .find({
                            'geoLocation.geo': {
                                $near: { 
                                    $geometry: { 
                                        type: 'Point',
                                        coordinates: [searchFrom.lng, searchFrom.lat]
                                    }
                                } 
                            }
                        })
                        .limit(25)
                        .exec(function(err, venues) {
                            console.log(venues);
                            locals.venues = venues;
                            next(err);
                        });
                } else {
                    next("Error for Google Maps API", jsonData.status)
                }
            });
        }).on('error', function (e) {
            console.log('Got error: ' + e.message);
            next(e.message);
        });;
    }

    view.on('get', function(next) {
        doGeocode(req.query.vicinity, next);
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