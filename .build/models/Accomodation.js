"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var accomodationSchema = new mongoose_1.default.Schema({
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
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
            _id: { type: mongoose_1.default.Schema.Types.ObjectId, auto: true },
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
var Accomodation = mongoose_1.default.model('Place', accomodationSchema);
exports.default = Accomodation;
//# sourceMappingURL=Accomodation.js.map