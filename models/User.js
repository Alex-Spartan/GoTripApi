const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        Unique: true,
    },
    status: {
        type: String,
        require: true,
        default: 'customer'
    },
    password: {
        type: String,
        require: true,
    },
    bookings: [{
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Accomodation'
        },
        price: {
            type: Number,
            require: true,
        },
        checkIn: {
            type: Date,
            require: true,
        },
        checkOut: {
            type: Date,
            require: true,
        },

    }]
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
