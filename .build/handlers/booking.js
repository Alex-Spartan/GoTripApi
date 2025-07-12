"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = exports.deleteBooking = exports.updateBooking = exports.createBooking = exports.getBookings = exports.handler = void 0;
var Bookings_1 = require("../models/Bookings");
var dotenv_1 = require("dotenv");
var stripe_1 = require("stripe");
var db_1 = require("../utils/db");
(0, dotenv_1.config)();
var stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-06-20",
});
var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (event.httpMethod) {
            case "GET":
                return [2 /*return*/, (0, exports.getBookings)(event)];
            case "POST":
                return [2 /*return*/, (0, exports.createBooking)(event)];
            case "PUT":
                return [2 /*return*/, (0, exports.updateBooking)(event)];
            case "DELETE":
                return [2 /*return*/, (0, exports.deleteBooking)(event)];
            case "OPTIONS":
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({ message: "CORS preflight response" })
                    }];
            default:
                return [2 /*return*/, {
                        statusCode: 405,
                        body: JSON.stringify({ message: "Method Not Allowed", error: true })
                    }];
        }
        return [2 /*return*/];
    });
}); };
exports.handler = handler;
var getBookings = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var id, bookings, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = (event.pathParameters || {}).id;
                if (!id) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: "User ID is required", error: true })
                        }];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, db_1.default)()];
            case 2:
                _a.sent();
                return [4 /*yield*/, Bookings_1.default.find({ userId: id })];
            case 3:
                bookings = _a.sent();
                if (!bookings || bookings.length === 0) {
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: JSON.stringify({ message: "No Booking found", error: true })
                        }];
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({ bookings: bookings, error: false })
                    }];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: "Internal server error", error: true })
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getBookings = getBookings;
var createBooking = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var data, booking;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = JSON.parse(event.body || '{}');
                if (!data.userId ||
                    !data.hotelId ||
                    !data.hotelName ||
                    !data.roomId ||
                    !data.rooms ||
                    !data.roomName ||
                    !data.guests.adults ||
                    !data.checkInDate ||
                    !data.checkOutDate ||
                    !data.totalAmount ||
                    !data.bookingReference ||
                    data.status !== "confirmed" ||
                    data.paymentStatus !== "paid" ||
                    !data.customerEmail ||
                    !data.customerPhone ||
                    !data.currency) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: "All fields are required", error: true })
                        }];
                }
                booking = new Bookings_1.default(__assign({}, data));
                return [4 /*yield*/, booking.save()];
            case 1:
                _a.sent();
                return [2 /*return*/, {
                        statusCode: 201,
                        body: JSON.stringify({ message: "Booking created successfully", error: false })
                    }];
        }
    });
}); };
exports.createBooking = createBooking;
var updateBooking = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var id, bookingData, updatedBooking, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = (event.pathParameters || {}).id;
                if (!id) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: "Booking ID is required", error: true })
                        }];
                }
                bookingData = JSON.parse(event.body || '{}');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Bookings_1.default.findByIdAndUpdate(id, bookingData)];
            case 2:
                updatedBooking = _a.sent();
                if (!updatedBooking) {
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: JSON.stringify({ message: "Booking not found", error: true })
                        }];
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({ message: "Booking updated successfully", error: false })
                    }];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: "Internal server error", error: true })
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateBooking = updateBooking;
var deleteBooking = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deletedBooking, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = (event.pathParameters || {}).id;
                if (!id) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: "Booking ID is required", error: true })
                        }];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Bookings_1.default.findByIdAndDelete(id)];
            case 2:
                deletedBooking = _a.sent();
                if (!deletedBooking) {
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: JSON.stringify({ message: "Booking not found", error: true })
                        }];
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({ message: "Booking deleted successfully", error: false })
                    }];
            case 3:
                err_3 = _a.sent();
                console.error(err_3);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: "Internal server error", error: true })
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteBooking = deleteBooking;
var createPaymentIntent = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, _b, currency, metadata, description, paymentIntent, error_1;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = JSON.parse(event.body || '{}'), amount = _a.amount, _b = _a.currency, currency = _b === void 0 ? "inr" : _b, metadata = _a.metadata;
                description = "Hotel booking for ".concat(metadata === null || metadata === void 0 ? void 0 : metadata.userId, " at ").concat((metadata === null || metadata === void 0 ? void 0 : metadata.hotelName) || "hotel", " from ").concat(((_c = metadata === null || metadata === void 0 ? void 0 : metadata.checkIn) === null || _c === void 0 ? void 0 : _c.split("T")[0]) || "", " to ").concat(((_d = metadata === null || metadata === void 0 ? void 0 : metadata.checkOut) === null || _d === void 0 ? void 0 : _d.split("T")[0]) || "");
                return [4 /*yield*/, stripe.paymentIntents.create({
                        amount: Math.round(amount * 100), // Convert to cents
                        currency: currency,
                        description: description,
                        metadata: metadata,
                        automatic_payment_methods: {
                            enabled: true,
                        },
                    })];
            case 1:
                paymentIntent = _e.sent();
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({
                            clientSecret: paymentIntent.client_secret,
                            error: false
                        })
                    }];
            case 2:
                error_1 = _e.sent();
                console.error("Error creating payment intent:", error_1);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({
                            message: "Internal server error",
                            error: true
                        })
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPaymentIntent = createPaymentIntent;
//# sourceMappingURL=booking.js.map