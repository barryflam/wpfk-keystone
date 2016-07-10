var keystone = require('keystone');
var Venue = keystone.list('Venue');
var https = require('https');

exports = module.exports = function(req, res) {
    var googleApiKey = process.env.GOOGLE_SERVER_API_KEY;

	var view = new keystone.View(req, res);
	var locals = res.locals;

    var doGeocode = function(address, next) {
        var encodedAddress = encodeURIComponent(address);

        https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedAddress + '&key=' + googleApiKey, (apiRes) => {
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
                console.log(JSON.parse(body));
                next();
            });
        }).on('error', function (e) {
            console.log('Got error: ' + e.message);
            next();
        });;
    }

    view.on('get', function(next) {
        doGeocode("1 Kings Road, PE27 5QR", next);
    });

    view.on('post', function(next) {
        Venue.paginate({
            page: req.query.page || 1,
            perPage: 25
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