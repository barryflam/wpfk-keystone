// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');
var successCount = 0;
var failCount = 0;
var totalCount = 0;

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'WPFK',
	'brand': 'WPFK',
	'cookie secret': process.env.COOKIE_SECRET,
	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',
	'cloudinary config': process.env.CLOUDINARY_URL,
	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs'
	}).engine,
	
	'emails': 'templates/emails',
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
    'google api key': process.env.GOOGLE_API_KEY,
    'google server api key': process.env.GOOGLE_SERVER_API_KEY,
    'default region': 'gb'
});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));


// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	// 'galleries': 'galleries',
	// 'enquiries': 'enquiries',
	'users': 'users',
    'venues': 'venues'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();

var Venue = keystone.list('Venue');
var https = require('https');
var googleApiKey = "AIzaSyA22GAKQI3zwz-TEaxweEzQu1IgMKjLbIs";

var doGeocode = function(address, next) {
    address = address.replace(/(?:\r\n|\r|\n)/g, ', ');

    console.log(address);

    https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=' + googleApiKey, (apiRes) => {
        // consume response body
        apiRes.setEncoding('utf8');
        var body = "";

        apiRes.on('data', function (data) {
            if (data !== undefined) {
                body += data;
            }
        });

        apiRes.on('end', function () {
            console.log('Request end');
            try {
                var jsonData = JSON.parse(body);
            }
            catch (e) {
                console.log('Type error', e.message);
                next('Error for address ' + address);
            }
            if(jsonData && jsonData.results && jsonData.results.length > 0) {
                next(jsonData.results[0].geometry.location);
            } else {
                next('Error for address ' + address);
            }
        });
    }).on('error', function (e) {
        console.log('Got error: ' + e.message);
        next(e.message);
    });;
}

Venue.model
    .find({'geoLocation': { "$exists" : false }, 'address': { "$exists" : true }})
    .exec(function(err, venues) {
        venues.forEach(function(venue) {
            totalCount++;
            doGeocode(venue.address, function (location) {
                if(location.lat) {
                    successCount++;
                    console.log(venue._id, location.lat, location.lng);
                    Venue.model.update(
                        { _id: venue._id },
                        {
                            $set: {
                                lat: location.lat,
                                lng: location.lng,
                                geoLocation: {
                                    geo: [location.lng, location.lat],
                                    country: 'United Kingdom'
                                }
                            }
                        }
                    ).exec(function() {
                        console.log('Inserted for id', venue._id);
                    });;
                } else {
                    failCount++;
                    console.log('ERROR ['+venue._id+']: ', location);
                }
                console.log('Success:', successCount, 'Failure:', failCount, 'Total:', totalCount)
            });
        });
    });