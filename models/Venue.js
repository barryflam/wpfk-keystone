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
        indoorActivities: { type: Boolean, label: 'Indoor activities', index: true },
        outdoorActivities: { type: Boolean, label: 'Outdoor activities', index: true },        
        food: { type: Boolean, label: 'Restaurants and food', index: true },
        pubs: { type: Boolean, label: 'Pubs with gardens or play facilities', index: true },
        hotels: { type: Boolean, label: 'Hotels', index: true },
        groups: { type: Boolean, label: 'Toddler groups', index: true },
        classes: { type: Boolean, label: 'Baby classes', index: true },
        swimming: { type: Boolean, label: 'Swimming and splash parks', index: true },
        outdoors: { type: Boolean, label: 'Parks, walks and outdoor fun', index: true },
        animals: { type: Boolean, label: 'Open farms, safari parks and zoos', index: true },
        culture: { type: Boolean, label: 'Museums and cultural activities', index: true },
        libraries: { type: Boolean, label: 'Libraries', index: true },
        sports: { type: Boolean, label: 'Sports', index: true }
    },
    address: { type: Types.Textarea, initial: false, required: true },
    placeId: { type: String, label: 'Place Id', default: 'NoPlaceId', unique: true },
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
        isFree: { type: Types.Select, label: 'Tier 2 price: Is free of charge?', required: true, options: 'No, Yes', emptyOption: false, default: 'No' },
        adult: { type: Types.Money, label: 'Tier 2 price: Adult price amount (£)', currency: 'en-gb' },
        child: { type: Types.Money, label: 'Tier 2 price: Child price amount (£)', currency: 'en-gb' },
        infant: { type: Types.Money, label: 'Tier 2 price: Infant price amount (£)', currency: 'en-gb' },
        senior: { type: Types.Money, label: 'Tier 2 price: Senior price amount (£)', currency: 'en-gb' },
        family: { type: Types.Money, label: 'Tier 2 price: Family price amount (£)', currency: 'en-gb' },
        otherDescription: { type: Types.Html, label: 'Premium other price', wysiwyg: true, height: 150, initial: false, required: false },
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
        childAge: { type: String, label: "Your childrens age" },
        agreement: { type: Boolean, label: "Please tick to get future updates from WPFK" } 
    },
    isPremiumListing: { type: Boolean, label: 'Is a premium listing?', initial: false, default: false },
    openingHoursType: { type: Types.Select, options: 'Tier 1, Tier 2', label: 'Use Tier 1 or Tier 2 opening hours?', default: 'Tier 1' },
    premium: {
        websiteText: { type: String, label: "Website button text", default: "Visit website" },
        websiteLink: { type: Types.Url, label: "Website button link" },
        additionalImage1: { type: Types.CloudinaryImage, label: "Image 2 for carousel" },
        additionalImage2: { type: Types.CloudinaryImage, label: "Image 3 for carousel" },
        additionalImage3: { type: Types.CloudinaryImage, label: "Image 4 for carousel" },
        additionalImage4: { type: Types.CloudinaryImage, label: "Image 5 for carousel" },
        additionalImage5: { type: Types.CloudinaryImage, label: "Image 6 for carousel" },
        additionalImage6: { type: Types.CloudinaryImage, label: "Image 7 for carousel" },
        additionalImage7: { type: Types.CloudinaryImage, label: "Image 8 for carousel" },
        additionalImage8: { type: Types.CloudinaryImage, label: "Image 9 for carousel" },
        additionalImage9: { type: Types.CloudinaryImage, label: "Image 10 for carousel" },
        promoListing: { type: String, label: "Promo for search listing" },
        promoTitle: { type: String, label: "Promo title" },
        promoText: { type: Types.Html, label: "Promo text", wysiwyg: true, height: 150, initial: false },
        priceTier1Title: { type: String, label: "Price tier 1 title" },
        priceTier2Title: { type: String, label: "Price tier 2 title" },
        tier2prices: {
            isFree: { type: Types.Select, label: 'Is free of charge?', options: 'No, Yes', emptyOption: false, default: 'No' },
            adult: { type: Types.Money, label: 'Adult price amount (£)', currency: 'en-gb' },
            child: { type: Types.Money, label: 'Child price amount (£)', currency: 'en-gb' },
            infant: { type: Types.Money, label: 'Infant price amount (£)', currency: 'en-gb' },
            senior: { type: Types.Money, label: 'Senior price amount (£)', currency: 'en-gb' },
            family: { type: Types.Money, label: 'Family price amount (£)', currency: 'en-gb' },
            otherDescription: { type: Types.Html, label: 'Other price description', wysiwyg: true, height: 150, initial: false, required: false },
        },
        tier2openingHours: {
            monday: {
                isOpen: { type: Boolean, label: 'Tier 2 Open Monday?' },
                open: {
                    from: { type: Number, label: 'Monday Open From' },
                    to: { type: Number, label: 'Monday Open To' }
                }
            },
            tuesday: {
                isOpen: { type: Boolean, label: 'Tier 2 Open Tuesday?' },
                open: {
                    from: { type: Number, label: 'Tuesday Open From' },
                    to: { type: Number, label: 'Tuesday Open To' }
                }
            },
            wednesday: {
                isOpen: { type: Boolean, label: 'Tier 2 Open Wednesday?' },
                open: {
                    from: { type: Number, label: 'Wednesday Open From' },
                    to: { type: Number, label: 'Wednesday Open To' }
                }
            },
            thursday: {
                isOpen: { type: Boolean, label: 'Tier 2 Open Thursday?' },
                open: {
                    from: { type: Number, label: 'Thursday Open From' },
                    to: { type: Number, label: 'Thursday Open To' }
                }
            },
            friday: {
                isOpen: { type: Boolean, label: 'Tier 2 Open Friday?' },
                open: {
                    from: { type: Number, label: 'Friday Open From' },
                    to: { type: Number, label: 'Friday Open To' }
                }
            },
            saturday: {
                isOpen: { type: Boolean, label: 'Tier 2 Open Saturday?' },
                open: {
                    from: { type: Number, label: 'Saturday Open From' },
                    to: { type: Number, label: 'Saturday Open To' }
                }
            },
            sunday: {
                isOpen: { type: Boolean, label: 'Tier 2 Open Sunday?' },
                open: {
                    from: { type: Number, label: 'Sunday Open From' },
                    to: { type: Number, label: 'Sunday Open To' }
                }
            }
        },
    },
    addedOn: { type: Date, default: Date.now }
});

Venue.schema.virtual('childrensAges').get(function () {
    return this.user.childAge ? this.user.childAge.replace(',', ' and ').replace(' ', ' and ') : '';
});

Venue.schema.virtual('formattedDate').get(function () {
    var date = new Date(this.addedOn); 
    return date.toDateString();
});

Venue.schema.virtual('openToday').get(function () {
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const todayIndex = new Date().getDay();
    const today = days[todayIndex];
    const openingHours = this.openingHoursType === "Tier 1" ? this.openingHours : this.premium.tier2openingHours;

    if (openingHours[today].isOpen) {
        return {
            from: ("0000" + openingHours[today].open.from).substr(-4,4),
            to: ("0000" + openingHours[today].open.to).substr(-4,4) 
        };
    }   

    return false;
});

Venue.schema.virtual('latLng').get(function() {
    if (this.geoLocation.geo) {
        return this.geoLocation.geo[1] + "," + this.geoLocation.geo[0];
    }
    
    return "51.507414,-0.127692";
});

Venue.schema.virtual('inlineAddress').get(function() {
    var inlineAddress = this.address;
    inlineAddress = inlineAddress ? inlineAddress.replace(/\r?\n|\r/g, ', ') : '';
    return inlineAddress;
});

Venue.schema.virtual('costsMoney').get(function() {
	return this.prices.isFree === "No";
//    return this.prices.adult > 0 || this.prices.child > 0 || this.prices.infant > 0;
});

Venue.schema.virtual('activityType').get(function() {
    return Object.keys(this.venueType).filter(function (value) {
        return typeof this[value] === "boolean";
    }, this.venueType).map(function (value) {
        var node = Venue.schema.paths['venueType.' + value]; 
        return node.options.label;
    }, this.venueType);
});

Venue.schema.virtual('facilities').get(function() {
    return Object.keys(this.services).filter(function (value) {
        return typeof this[value] === "boolean";
    }, this.services).map(function (value) {
        var node = Venue.schema.paths['services.' + value]; 
        return node.options.label;
    }, this.venueType);;
});

Venue.schema.virtual('currentActivityTypes').get(function() {
    return Object.keys(this.venueType).filter(function (value) {
        return typeof this[value] === "boolean" && this[value] === true;
    }, this.venueType).map(function (value) {
        var node = Venue.schema.paths['venueType.' + value]; 
        return node.options.label;
    }, this.venueType);
});

Venue.schema.virtual('currentFacilities').get(function() {
    return Object.keys(this.services).filter(function (value) {
        return typeof this[value] === "boolean" && this[value] === true;
    }, this.services).map(function (value) {
        var node = Venue.schema.paths['services.' + value]; 
        return node.options.label.replace("?","");
    }, this.venueType);;
});

Venue.schema.virtual('opens').get(function() {
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        out = [];

    days.forEach(function (day) {
        var today = this.openingHours[day];

        if (this.openingHours[day].isOpen) {
            out.push('<span class="wpfk--venue-kv-key">' + day.charAt(0).toUpperCase() + day.slice(1) + '</span> <span class="wpfk--venue-kv-value">' + ("0000" + today.open.from).substr(-4,4) + " - " + ("0000" + today.open.to).substr(-4,4) + '</span>');
        } else {
            out.push('<span class="wpfk--venue-kv-key">' + day.charAt(0).toUpperCase() + day.slice(1) + '</span> <span class="wpfk--venue-kv-value">Closed</span>');
        }
    }, this);

    return out;
});

Venue.schema.virtual('opensTier2').get(function() {
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        out = [];

    days.forEach(function (day) {
        var today = this.premium.tier2openingHours[day];

        if (this.premium.tier2openingHours[day].isOpen) {
            out.push('<span class="wpfk--venue-kv-key">' + day.charAt(0).toUpperCase() + day.slice(1) + '</span> <span class="wpfk--venue-kv-value">' + ("0000" + today.open.from).substr(-4,4) + " - " + ("0000" + today.open.to).substr(-4,4) + '</span>');
        } else {
            out.push('<span class="wpfk--venue-kv-key">' + day.charAt(0).toUpperCase() + day.slice(1) + '</span> <span class="wpfk--venue-kv-value">Closed</span>');
        }
    }, this);

    return out;
});

/*
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
*/

Venue.schema.virtual('suitableForPremium').get(function() {
    var minimumAge = "to6M",
        maximumAge = "from12Y",
        orderedAges = [
            "to6M", 
            "from6Mto1Y",
            "from1Yto2Y",
            "from2Yto3Y",
            "from3Yto4Y",
            "from4Yto5Y",
            "from5Yto6Y",
            "from6Yto7Y",
            "from7Yto8Y",
            "from8Yto9Y",
            "from9Yto10Y",
            "from10Yto12Y",
            "from12Y"];

    function stringToAgeMapper(minAge, maxAge)
    {
        var ageMapper = {
            "to6M": {
                min: "birth",
                max: "to 6 months"
            },
            "from6Mto1Y": {
                min: "6 months",
                max: "to 1 year"
            },
            "from1Yto2Y": {
                min: "1 year",
                max: "to 2 years"
            },
            "from2Yto3Y": {
                min: "2 years",
                max: "to 3 years"
            },
            "from3Yto4Y": {
                min: "3 years",
                max: "to 4 years"
            },
            "from4Yto5Y": {
                min: "4 years",
                max: "to 5 years"
            },
            "from5Yto6Y": {
                min: "5 years",
                max: "to 6 years"
            },
            "from6Yto7Y": {
                min: "6 years",
                max: "to 7 years"
            },
            "from7Yto8Y": {
                min: "7 years",
                max: "to 8 years"
            },
            "from8Yto9Y": {
                min: "8 years",
                max: "to 9 years"
            },
            "from9Yto10Y": {
                min: "9 years",
                max: "to 10 years"
            },
            "from10Yto12Y": {
                min: "10 years",
                max: "to 12 years"
            },
            "from12Y": {
                min: "12 years",
                max: "and above"
            }
        }

        return ageMapper[minAge]["min"] + " " + ageMapper[maxAge]["max"];
    }

    orderedAges.forEach(function (value) {
        var checked = typeof this[value] === "boolean" && this[value] === true;
        var minimumChecked = typeof this["from6M"] === "boolean" && this["from6M"] === true;

        if (checked) {
            if(minimumAge === "to6M" && !minimumChecked)
            {
                minimumAge = value;
            }

            maximumAge = value;
        }
    }, this.suitableForAges);

    return stringToAgeMapper(minimumAge, maximumAge);
});

Venue.schema.index(
    {
        venueName: 'text',
        address: 'text',
        description: 'text'
    },
    {
        name: 'Venue search text index',
        weights: {
            venueName: 10,
            address: 5,
            description: 5
        }
    }
);

Venue.schema.virtual('premiumVenueCarousel').get(function() {
    const images = [
        this.image,
        this.premium.additionalImage1,
        this.premium.additionalImage2,
        this.premium.additionalImage3,
        this.premium.additionalImage4,
        this.premium.additionalImage5,
        this.premium.additionalImage6,
        this.premium.additionalImage7,
        this.premium.additionalImage8,
        this.premium.additionalImage9
    ];

    return images.filter(function(image) {
        return image.exists;
    });
});
 
Venue.defaultColumns = 'name, addedByWPFK|20%, state|20%'
Venue.register();
