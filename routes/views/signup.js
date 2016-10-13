var keystone = require('keystone');
var EmailSignup = keystone.list('EmailSignup');
var https = require('https');

exports = module.exports = function(req, res, next) {
	var locals = res.locals;
    var redirectTo = '/';

    var email = req.body.email;

    var newSignup = new EmailSignup.model(),
        updater = newSignup.getUpdateHandler(req);

    redirectTo = '/' + (req.body.origin === "home" ? "" : req.body.origin);

    updater.process(req.body, {
        flashErrors: true,
        fields: "email",
        errorMessage: 'There was a problem signing you up'
    }, function(err) {
        res.redirect(redirectTo);
    });
};