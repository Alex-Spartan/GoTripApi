import mongoose from "mongoose";

const accomodationSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
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

}, {
    timestamps: true,
});

const Accomodation = mongoose.model('Place', accomodationSchema);

export default Accomodation;