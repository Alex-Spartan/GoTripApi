const mongoose = require('mongoose');

const accomodationSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    photos: [String],
    amenities: [String],
    extraInfo: String,
    mainImage: String,
    phone: String,
    ratings: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    roomTypes: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true },
        maxOccupancy: { type: Number, default: 2 },
        bedType: String,
        size: { type: Number, default: 35 },
        price: { type: Number, default: 0 },
        images: [String],
        amenities: [String],
        available: { type: Boolean, default: true }
    }],
    guests: [
        {
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        }
    ]
});

const Place = mongoose.model('Place', accomodationSchema);
module.exports = Place;
