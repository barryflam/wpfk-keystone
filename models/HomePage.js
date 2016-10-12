var keystone = require('keystone'),
    Types = keystone.Field.Types;

var HomePage = new keystone.List('HomePage', {
    autokey: { path: 'slug', from: 'title', unique: true },
    map: { name: 'title' },
    defaultSort: 'title'
});

HomePage.add({
    title: { type: String, required: true },
    heroImage: { type: Types.CloudinaryImage, label: "Homepage hero image (1280px x 422px)" },
    content: { type: Types.Html, wysiwyg: true, height: 150, initial: false, required: false },
	section1Title: { type: String, label: "Section 1 Title" },
	section1Strapline: { type: String, label: "Section 1 Strapline"},
    section1Box1Title: { type: String, label: "Section 1 Box 1 Title"},
    section1Box1Image: { type: Types.CloudinaryImage, label: "Section 1 Box 1 Image (310px x 310px)"},
    section1Box1Link: { type: Types.Url, label: "Section 1 Box 1 Link"},
    section1Box2Title: { type: String, label: "Section 1 Box 2 Title"},
    section1Box2Image: { type: Types.CloudinaryImage,  label: "Section 1 Box 2 Image (310px x 310px)"},
    section1Box2Link: { type: Types.Url, label: "Section 1 Box 2 Link"},
    section1Box3Title: { type: String, label: "Section 1 Box 3 Title"},
    section1Box3Image: { type: Types.CloudinaryImage,  label: "Section 1 Box 3 Image (310px x 310px)"},
    section1Box3Link: { type: Types.Url, label: "Section 1 Box 3 Link"},
    section1LinkUrl: { type: Types.Url, label: "Section 1 Main Link Url"},
    section1LinkText: { type: String, label: "Section 1 Main Link Text"},
    section2Title: { type: String, label: "Section 2 Title" },
	section2Strapline: { type: String, label: "Section 2 Strapline"},
    section2Box1Title: { type: String, label: "Section 2 Box 1 Title"},
    section2Box1Image: { type: Types.CloudinaryImage,  label: "Section 2 Box 1 Image (310px x 310px)"},
    section2Box1Link: { type: Types.Url, label: "Section 2 Box 1 Link"},
    section2Box2Title: { type: String, label: "Section 2 Box 2 Title"},
    section2Box2Image: { type: Types.CloudinaryImage,  label: "Section 2 Box 2 Image (310px x 310px)"},
    section2Box2Link: { type: Types.Url, label: "Section 2 Box 2 Link"},
    section2Box3Title: { type: String, label: "Section 2 Box 3 Title"},
    section2Box3Image: { type: Types.CloudinaryImage,  label: "Section 2 Box 3 Image (310px x 310px)"},
    section2Box3Link: { type: Types.Url, label: "Section 2 Box 3 Link"},
    section2LinkUrl: { type: Types.Url, label: "Section 2 Main Link Url"},
    section2LinkText: { type: String, label: "Section 2 Main Link Text"}    
});

HomePage.defaultColumns = 'title';
HomePage.register();
