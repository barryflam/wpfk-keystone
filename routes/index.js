/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */
require('dotenv').load();

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var ReCaptchaMiddleware = require('express-recaptcha-middleware')(process.env.GOOGLE_RECAPTCHA_KEY);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.home);
    app.get('/search', routes.views.search);
    app.post('/search-results', routes.views.searchResults);
    app.get('/venue/:slug', routes.views.venue);           
	app.all('/recommend', routes.views.recommend);
    app.post('/review', ReCaptchaMiddleware('g-recaptcha-response'), routes.views.review, function(err, req, res, next) {
        if (err.name === 'NotFoundReCaptcha' || err.name === 'InvalidRecaptcha') {
            var venueSlug = req.body.venueSlug;
            req.flash('error', { detail: 'Invalid recaptcha' });
            res.redirect('/venue/' + venueSlug);
        }

        next();
    });
    app.post('/signup', routes.views.signup);
    app.get('/:slug', routes.views.about);
    app.get('/place-check/:placeId', routes.views.placeCheck);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
