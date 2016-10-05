var keystone = require('keystone');
var EmailSignup = keystone.list('EmailSignup');
var https = require('https');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

    view.on('post', function(next) {
        console.log(res);
    });
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'signup';
	
	// Render the view
	view.render('signup');
};