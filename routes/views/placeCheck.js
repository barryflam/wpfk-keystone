var keystone = require('keystone');
var Venue = keystone.list('Venue');

exports = module.exports = function(req, res) {
    var placeId = req.params.placeId;

    Venue.model.findOne({ 'placeId': placeId }, '', function (err, venue) {
        if (venue) {
            res.json({ "venue_slug": venue.slug });
        } else {
            res.json({ "venue_slug": "" });
        }

        res.end();
    });
};