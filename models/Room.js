const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Accomodation', required: true },
  name: { type: String, required: true },
  description: String,
  maxOccupancy: { type: Number, default: 2 },
  bedType: String,
  size: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  images: [String],
  amenities: [String],
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Room', roomSchema);