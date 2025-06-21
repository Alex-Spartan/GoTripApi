const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    hotelName: { type: String, required: true },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    guests: {
      adults: { type: Number, required: true },
      children: { type: Number, required: true },
    },
    rooms: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
