var keystone = require('keystone');
var Types = keystone.Field.Types;

var EmailSignup = new keystone.List('EmailSignup');

EmailSignup.add({
	email: { type: Types.Email, initial: true, required: true, index: true },
});

EmailSignup.defaultColumns = 'email';
EmailSignup.register();
