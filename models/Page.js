var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Page = new keystone.List('Page', {
    autokey: { path: 'slug', from: 'title', unique: true },
    map: { name: 'title' },
    defaultSort: 'title'
});

Page.add({
	title: { type: String, required: true },
	content: { type: Types.Html, wysiwyg: true, height: 150, initial: false, required: false },
});

Page.defaultColumns = 'title';
Page.register();
