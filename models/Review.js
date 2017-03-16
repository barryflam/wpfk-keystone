var keystone = require('keystone'),
    Types = keystone.Field.Types;
 
var Review = new keystone.List('Review');

Review.add({
    yourName: { type: String, label: "Your name" },
    email: { type: Types.Email, label: "Email", required: true, initial: false },
    rating: { type: Types.Select, numeric: true, options: [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
    ]},
    children: {
        child1Name: { type: String, label: "Child 1 name" },
        child1Age: { type: String, label: "Child 1 age" },
        child2Name: { type: String, label: "Child 2 name" },
        child2Age: { type: String, label: "Child 2 age" },
        child3Name: { type: String, label: "Child 3 name" },
        child3Age: { type: String, label: "Child 3 age" },
        child4Name: { type: String, label: "Child 4 name" },
        child4Age: { type: String, label: "Child 4 age" },
        child5Name: { type: String, label: "Child 5 name" },
        child5Age: { type: String, label: "Child 5 age" }
    },
    description: { type: Types.Html, wysiwyg: true, height: 150, initial: false, required: true },
    ipAddress: { type: String, label: "User's IP address" },
    venueId: { type: Number },
    venueSlug: { type: String },
    addedOn: { type: Date, default: Date.now }
});

Review.schema.virtual('formattedDate').get(function () {
    var date = new Date(this.addedOn); 
    return date.toDateString();
});
 
Review.defaultColumns = 'yourName';
Review.register();