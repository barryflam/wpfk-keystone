var keystone = require('keystone'),
    Types = keystone.Field.Types;
 
var Venue = new keystone.List('Venue', {
    autokey: { path: 'slug', from: 'venueName', unique: true },
    map: { name: 'venueName' },
    defaultSort: 'venueName'
});
 
Venue.add({
    addedByWPFK: { type: Boolean, label: 'Added by WPFK staff?', index: true, default: false },
    venueState: { type: Types.Select, options: 'Not opened, Open, Closed', default: 'Open' },
    venueName: { type: String, label: 'Venue Name', index: true, required: true },
    venueType: {
        softplay: { type: Boolean, label: 'Softplay', index: true },
        indoorActivities: { type: Boolean, label: 'Indoor Activities', index: true },
        outdoorActivities: { type: Boolean, label: 'Outdoor Activities', index: true },        
        food: { type: Boolean, label: 'Restaurants and food', index: true },
        pubs: { type: Boolean, label: 'Pubs with gardens/play facilities', index: true },
        hotels: { type: Boolean, label: 'Hotels', index: true },
        groups: { type: Boolean, label: 'Toddler groups', index: true },
        classes: { type: Boolean, label: 'Baby classes', index: true },
        swimming: { type: Boolean, label: 'Swimming/Splash parks', index: true },
        outdoors: { type: Boolean, label: 'Parks/Walks/Outdoor fun', index: true },
        animals: { type: Boolean, label: 'Open Farms/Safari/Zoo', index: true },
        culture: { type: Boolean, label: 'Museums/Cultural activites', index: true },
        libraries: { type: Boolean, label: 'Libraries', index: true },
        sports: { type: Boolean, label: 'Sports', index: true }
    },
    address: { type: Types.Textarea, initial: false, required: true },
    placeId: { type: String, label: 'Place Id', default: 'NoPlaceId' },
    lat: { type: Types.Number, label: "Latitude", default: 0 },
    lng: { type: Types.Number, label: "Longitude", default: 0 },
    website: { type: Types.Url },
    telephoneNumber: { type: String },
    description: { type: Types.Html, wysiwyg: true, height: 150, initial: false, required: true },
    rating: { type: Types.Select, numeric: true, options: [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
    ]},
    suitableForAges: { 
        to6M:  { type: Boolean, label: 'Suitable for 0-6m?', index: true },
        from6Mto1Y:  { type: Boolean, label: 'Suitable for 6m-1y?', index: true },
        from1Yto2Y:  { type: Boolean, label: 'Suitable for 1-2y?', index: true },
        from2Yto3Y:  { type: Boolean, label: 'Suitable for 2-3y?', index: true },
        from3Yto4Y:  { type: Boolean, label: 'Suitable for 3-4y?', index: true },
        from4Yto5Y:  { type: Boolean, label: 'Suitable for 4-5y?', index: true },
        from5Yto6Y:  { type: Boolean, label: 'Suitable for 5-6y?', index: true },
        from6Yto7Y:  { type: Boolean, label: 'Suitable for 6-7y?', index: true },
        from7Yto8Y:  { type: Boolean, label: 'Suitable for 7-8y?', index: true },
        from8Yto9Y:  { type: Boolean, label: 'Suitable for 8-9y?', index: true },
        from9Yto10Y:  { type: Boolean, label: 'Suitable for 9-10y?', index: true },
        from10Yto12Y:  { type: Boolean, label: 'Suitable for 10-12y?', index: true },
        from12Y:  { type: Boolean, label: 'Suitable for 12y+?', index: true },   
    },
    bookingRequired: { type: Boolean, label: 'Booking required?' },
    services: { 
        babyChanging: { type: Boolean, label: 'Baby changing available?' },
        childrensMenu: { type: Boolean, label: 'Has a childrens menu?' },
        wheelAccessible: { type: Boolean, label: 'Pram/Wheelchair accessible?' },
        suitableForMany: { type: Boolean, label: 'Suitable for twins/multiples?' },
        doublePramFriendly: { type: Boolean, label: 'Double pram friendly?' },
        goodFood: { type: Boolean, label: 'Good food for parents?' },
        kidsParties: { type: Boolean, label: 'Available for kids parties?' }        
    },
    prices: {
        adult: { type: Types.Money, label: 'Adult price amount (£)', currency: 'en-gb' },
        child: { type: Types.Money, label: 'Child price amount (£)', currency: 'en-gb' },
        infant: { type: Types.Money, label: 'Infant price amount (£)', currency: 'en-gb' },
        otherDescription: { type: String, label: 'Other price description', currency: 'en-gb' }
    },
    openingHours: {
        monday: {
            isOpen: { type: Boolean, label: 'Open Monday?' },
            open: {
                from: { type: Number, label: 'Monday Open From' },
                to: { type: Number, label: 'Monday Open To' }
            }
        },
        tuesday: {
            isOpen: { type: Boolean, label: 'Open Tuesday?' },
            open: {
                from: { type: Number, label: 'Tuesday Open From' },
                to: { type: Number, label: 'Tuesday Open To' }
            }
        },
        wednesday: {
            isOpen: { type: Boolean, label: 'Open Wednesday?' },
            open: {
                from: { type: Number, label: 'Wednesday Open From' },
                to: { type: Number, label: 'Wednesday Open To' }
            }
        },
        thursday: {
            isOpen: { type: Boolean, label: 'Open Thursday?' },
            open: {
                from: { type: Number, label: 'Thursday Open From' },
                to: { type: Number, label: 'Thursday Open To' }
            }
        },
        friday: {
            isOpen: { type: Boolean, label: 'Open Friday?' },
            open: {
                from: { type: Number, label: 'Friday Open From' },
                to: { type: Number, label: 'Friday Open To' }
            }
        },
        saturday: {
            isOpen: { type: Boolean, label: 'Open Saturday?' },
            open: {
                from: { type: Number, label: 'Saturday Open From' },
                to: { type: Number, label: 'Saturday Open To' }
            }
        },
        sunday: {
            isOpen: { type: Boolean, label: 'Open Sunday?' },
            open: {
                from: { type: Number, label: 'Sunday Open From' },
                to: { type: Number, label: 'Sunday Open To' }
            }
        }
    },
    geoLocation: { type: Types.Location, defaults: { country: 'United Kingdom' } },
    image: { type: Types.CloudinaryImage },
    state: { type: Types.Select, options: 'Draft, Published, Archived', default: 'Draft' },
    user: { 
        yourName: { type: String, label: "Your name" },
        email: { type: Types.Email, label: "Email", required: true, initial: false },
        childName: { type: String, label: "Your childrens name" },
        childAge: { type: Number, label: "Your childrens age" },
        agreement: { type: Boolean, label: "Please tick to get future updates from WPFK" } 
    },
    addedOn: { type: Date, default: Date.now }
});

Venue.schema.virtual('openToday').get(function () {
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const todayIndex = new Date().getDay();
    const today = days[todayIndex];

    if (this.openingHours[today].isOpen) {
        return {
            from: ("0000" + this.openingHours[today].open.from).substr(-4,4),
            to: ("0000" + this.openingHours[today].open.to).substr(-4,4) 
        };
    }   

    return false;
});

Venue.schema.virtual('costsMoney').get(function() {
    return this.prices.adult > 0 || this.prices.child > 0 || this.prices.infant > 0;
});

Venue.schema.virtual('facilities').get(function() {
    return Object.keys(this.services).filter(function (value) {
        return typeof this[value] === "boolean";
    }, this.services);
});

Venue.schema.virtual('opens').get(function() {
    return Object.keys(this.openingHours).filter(function (value) {
        return typeof this[value].isOpen === "boolean";
    }, this.openingHours).map(function (value) {
        return value + ": " + ("0000" + this[value].open.from).substr(-4,4) + " - " + ("0000" + this[value].open.to).substr(-4,4);
    }, this.openingHours);
});
 
Venue.defaultColumns = 'name, type, state|20%, publishedAt|15%'
Venue.register();
