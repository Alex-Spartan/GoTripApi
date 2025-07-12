"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var bookingSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Places", required: true },
    hotelName: { type: String, required: true },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    guests: {
        adults: { type: Number, required: true },
        children: { type: Number, required: true },
    },
    roomId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Places", required: true },
    rooms: { type: Number, required: true },
    currency: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
    },
    bookingReference: { type: String, required: true, unique: true },
}, { timestamps: true });
var Booking = mongoose_1.default.model("Booking", bookingSchema);
exports.default = Booking;
//# sourceMappingURL=Bookings.js.map