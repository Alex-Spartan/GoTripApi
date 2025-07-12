"use strict";
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
exports.handler = void 0;
var User_1 = require("../models/User");
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv_1 = require("dotenv");
var db_1 = require("../utils/db");
(0, dotenv_1.config)();
var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var httpMethod, path, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                httpMethod = event.httpMethod, path = event.path;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                if (!(httpMethod === 'POST')) return [3 /*break*/, 9];
                if (!path.includes('/signup')) return [3 /*break*/, 3];
                return [4 /*yield*/, signup(event)];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                if (!path.includes('/login')) return [3 /*break*/, 5];
                return [4 /*yield*/, login(event)];
            case 4: return [2 /*return*/, _a.sent()];
            case 5:
                if (!path.includes('/google-login')) return [3 /*break*/, 7];
                return [4 /*yield*/, googleLogin(event)];
            case 6: return [2 /*return*/, _a.sent()];
            case 7:
                if (!path.includes('/profile')) return [3 /*break*/, 9];
                return [4 /*yield*/, getProfile(event)];
            case 8: return [2 /*return*/, _a.sent()];
            case 9: return [2 /*return*/, {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Route not found', error: true })
                }];
            case 10:
                error_1 = _a.sent();
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'Internal server error', error: true })
                    }];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
var signup = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, password, existing, hashedPassword, user, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, (0, db_1.default)()];
            case 1:
                _b.sent();
                _a = JSON.parse(event.body || '{}'), fullName = _a.fullName, email = _a.email, password = _a.password;
                if (!fullName || !email || !password) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: "All fields are required", error: true })
                        }];
                }
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                existing = _b.sent();
                if (existing) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: "User already exists", error: true })
                        }];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                user = new User_1.default({
                    fullName: fullName,
                    email: email,
                    password: hashedPassword,
                    method: 'email',
                });
                return [4 /*yield*/, user.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, {
                        statusCode: 201,
                        body: JSON.stringify({
                            message: "User created",
                            error: false,
                            user: {
                                fullName: user.fullName,
                                email: user.email,
                                method: user.method,
                                _id: user._id,
                            }
                        })
                    }];
            case 5:
                error_2 = _b.sent();
                console.log(error_2);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: "Internal Server Error", error: true })
                    }];
            case 6: return [2 /*return*/];
        }
    });
}); };
var login = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, db_1.default)()];
            case 1:
                _b.sent();
                _a = JSON.parse(event.body || '{}'), email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: "Email and password are required", error: true })
                        }];
                }
                return [4 /*yield*/, User_1.default.findOne({ email: email, method: 'email' })];
            case 2:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, {
                            statusCode: 401,
                            body: JSON.stringify({ message: "Invalid credentials", error: true })
                        }];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, {
                            statusCode: 401,
                            body: JSON.stringify({ message: "Invalid credentials", error: true })
                        }];
                }
                token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return [2 /*return*/, {
                        statusCode: 200,
                        headers: {
                            'Set-Cookie': "token=".concat(token, "; HttpOnly; Secure; SameSite=Strict; Max-Age=3600")
                        },
                        body: JSON.stringify({
                            message: "Login successful",
                            error: false,
                            token: token,
                            user: {
                                fullName: user.fullName,
                                email: user.email,
                                method: user.method,
                                _id: user._id,
                            },
                        })
                    }];
            case 4:
                error_3 = _b.sent();
                console.log(error_3);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: "Internal Server Error", error: true })
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
var googleLogin = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, fullName, uid, user, token, token, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, (0, db_1.default)()];
            case 1:
                _b.sent();
                _a = JSON.parse(event.body || '{}'), email = _a.email, fullName = _a.fullName, uid = _a.uid;
                if (!email || !fullName || !uid) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ message: "Email, fullName, and uid are required", error: true })
                        }];
                }
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                user = _b.sent();
                if (!(user === null)) return [3 /*break*/, 4];
                user = new User_1.default({
                    fullName: fullName,
                    email: email,
                    method: 'google',
                    googleId: uid,
                });
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: "Login successful",
                            error: false,
                            user: user,
                            token: token
                        })
                    }];
            case 4:
                token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: "User already exists",
                            error: false,
                            user: user,
                            token: token
                        })
                    }];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _b.sent();
                console.log(error_4);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: "Internal Server Error", error: true })
                    }];
            case 7: return [2 /*return*/];
        }
    });
}); };
var getProfile = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, token_1, decoded, userId, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, db_1.default)()];
            case 1:
                _a.sent();
                body = JSON.parse(event.body || '{}');
                token_1 = body.token;
                if (!token_1) {
                    return [2 /*return*/, {
                            statusCode: 401,
                            body: JSON.stringify({ message: "Unauthorized - No token provided", error: true })
                        }];
                }
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        jsonwebtoken_1.default.verify(token_1, process.env.JWT_SECRET, {}, function (err, data) {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })];
            case 2:
                decoded = _a.sent();
                if (!decoded || typeof decoded !== 'object') {
                    return [2 /*return*/, {
                            statusCode: 401,
                            body: JSON.stringify({ message: "Invalid token", error: true })
                        }];
                }
                userId = decoded.id || decoded._id;
                return [4 /*yield*/, User_1.default.findById(userId)];
            case 3:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: JSON.stringify({ message: "User not found", error: true })
                        }];
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: "User profile fetched successfully",
                            error: false,
                            user: {
                                fullName: user.fullName,
                                email: user.email,
                                method: user.method,
                                _id: user._id,
                            }
                        })
                    }];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({
                            message: "Internal Server Error",
                            error: true,
                            details: err_1.message
                        })
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=auth.js.map