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
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
        }
    ],
    guests: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        }
    ]
});

const Place = mongoose.model('Place', accomodationSchema);
module.exports = Place;