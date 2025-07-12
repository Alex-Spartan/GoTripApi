"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
var User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map