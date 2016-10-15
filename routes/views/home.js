var keystone = require('keystone');
var HomePage = keystone.list('HomePage');
var Venues = keystone.list('Venue');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
    var venueTypePathRegex = new RegExp(/^venueType.*/);

    locals.activityDropdown = function() {
        var venues = [];
        
        var paths = Object.keys(Venues.schema.paths);

        paths.forEach(function (key) {
            var value = Venues.schema.paths[key];

            if (venueTypePathRegex.test(key)) {
                var activityType = key.replace('venueType.', '');
                venues.push({
                    value: activityType,
                    label: value.options.label 
                });
            }
        });

        return venues;
    } 
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
    locals.mainSite = true;

    view.on('get', function(next) {
        HomePage.model.findOne({ 'slug': 'home' }, '', function (err, page) {
            if (page) {
                locals.title = page.title
                locals.heroImage = page.heroImage
                locals.content = page.content
                locals.section1Title = page.section1Title
                locals.section1Strapline = page.section1Strapline
                locals.section1Box1Title = page.section1Box1Title
                locals.section1Box1Image = page.section1Box1Image
                locals.section1Box1Link = page.section1Box1Link
                locals.section1Box2Title = page.section1Box2Title
                locals.section1Box2Image = page.section1Box2Image
                locals.section1Box2Link = page.section1Box2Link
                locals.section1Box3Title = page.section1Box3Title
                locals.section1Box3Image = page.section1Box3Image
                locals.section1Box3Link = page.section1Box3Link
                locals.section1LinkUrl = page.section1LinkUrl
                locals.section1LinkText = page.section1LinkText
                locals.section2Title = page.section2Title
                locals.section2Strapline = page.section2Strapline
                locals.section2Box1Title = page.section2Box1Title
                locals.section2Box1Image = page.section2Box1Image
                locals.section2Box1Link = page.section2Box1Link
                locals.section2Box2Title = page.section2Box2Title
                locals.section2Box2Image = page.section2Box2Image
                locals.section2Box2Link = page.section2Box2Link
                locals.section2Box3Title = page.section2Box3Title
                locals.section2Box3Image = page.section2Box3Image
                locals.section2Box3Link = page.section2Box3Link
                locals.section2LinkUrl = page.section2LinkUrl
                locals.section2LinkText = page.section2LinkText
            } else {
                locals.title = "Page not found";
                res.status(404);
            }

            next(err);
        })
    });
	
	// Render the view
	view.render('home');
	
};