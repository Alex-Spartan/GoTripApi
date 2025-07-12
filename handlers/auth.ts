import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import connectDB from "../utils/db";
config();


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { httpMethod, path } = event;

    try {
        if (httpMethod === 'POST') {
            if (path.includes('/signup')) {
                return await signup(event);
            } else if (path.includes('/login')) {
                return await login(event);
            } else if (path.includes('/google-login')) {
                return await googleLogin(event);
            } else if (path.includes('/profile')) {
                return await getProfile(event);
            }
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Route not found', error: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: true })
        };
    }
};


const signup = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectDB();

        const { fullName, email, password } = JSON.parse(event.body || '{}');

        if (!fullName || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "All fields are required", error: true })
            };
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "User already exists", error: true })
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            method: 'email',
        });

        await user.save();

        return {
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
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: true })
        };
    }
};


const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectDB();

        const { email, password } = JSON.parse(event.body || '{}');

        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email and password are required", error: true })
            };
        }

        const user = await User.findOne({ email, method: 'email' });
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid credentials", error: true })
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid credentials", error: true })
            };
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
            },
            body: JSON.stringify({
                message: "Login successful",
                error: false,
                token,
                user: {
                    fullName: user.fullName,
                    email: user.email,
                    method: user.method,
                    _id: user._id,
                },
            })
        };

    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: true })
        };
    }
};

const googleLogin = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectDB();

        const { email, fullName, uid } = JSON.parse(event.body || '{}');

        if (!email || !fullName || !uid) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email, fullName, and uid are required", error: true })
            };
        }

        let user = await User.findOne({ email });

        if (user === null) {
            user = new User({
                fullName,
                email,
                method: 'google',
                googleId: uid,
            });

            await user.save();

            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Login successful",
                    error: false,
                    user,
                    token
                })
            };
        } else {
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "User already exists",
                    error: false,
                    user: user,
                    token
                })
            };
        }

    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: true })
        };
    }
};

const getProfile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectDB();

        const body = JSON.parse(event.body || '{}');
        const token = body.token;

        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized - No token provided", error: true })
            };
        }

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, {}, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        if (!decoded || typeof decoded !== 'object') {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid token", error: true })
            };
        }

        // Find user by ID from decoded token
        const userId = (decoded as any).id || (decoded as any)._id;
        const user = await User.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "User not found", error: true })
            };
        }

        return {
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
        };

    } catch (err: any) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error",
                error: true,
                details: err.message
            })
        };
    }
};
