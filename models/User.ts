import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        Unique: true,
    },
    status: {
        type: Number,
        require: true,
        default: 0 //0: customer, 1: admin
    },
    method: {
        type: String,
        require: true,
        default: 'email',
        enum: ['email', 'google']
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
}, { timestamps: true })

const User = mongoose.model('User', UserSchema);
export default User;
