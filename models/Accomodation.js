const mongoose = require('mongoose');


const accomodationSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true, unique: true},
    location: {type: String, required: true },
    description: String,
    photos: [String],
    amenities: [String],
    extraInfo: [String],
    rooms: [
        {
            roomType: {type: String, required: true},
            truePrice: {type: Number, required: true},
            refundPrice: {type: Number},
            photos: [String],
            amenities: [String],
        }
    
    ],
    guests: [
        {
            name : {type: String, required: true},
            email: {type: String, required: true},
            phone: {type: String, required: true},
            guestId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User'},
        }
    ]
})

const Place = mongoose.model('Place', accomodationSchema);
module.exports = Place;