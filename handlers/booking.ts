
import Bookings from "../models/Bookings";
import { config } from "dotenv";
import { Stripe } from "stripe";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import connectDB from "../utils/db";
config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-06-20",
});


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    switch (event.httpMethod) {
        case "GET":
            return getBookings(event);
        case "POST":
            return createBooking(event);
        case "PUT":
            return updateBooking(event);
        case "DELETE":
            return deleteBooking(event);
        case "OPTIONS":
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "CORS preflight response" })
            };
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method Not Allowed", error: true })
            };
    }
}

export const getBookings = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters || {};
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "User ID is required", error: true })
        }
    }
    try {
        await connectDB();
        
        const bookings = await Bookings.find({ userId: id })
        if (!bookings || bookings.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "No Booking found", error: true})
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ bookings, error: false })
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: true })
        }
    }
}

export const createBooking = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const data = JSON.parse(event.body || '{}');
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
        !data.currency
    ) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "All fields are required", error: true })
        }
    }
    const booking = new Bookings({
        ...data,
    });
    await booking.save()
    return {
        statusCode: 201,
        body: JSON.stringify({ message: "Booking created successfully", error: false })
    }
}


export const updateBooking = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters || {};
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Booking ID is required", error: true })
        }
    }
    const bookingData = JSON.parse(event.body || '{}');
    try {
        const updatedBooking = await Bookings.findByIdAndUpdate(id, bookingData);
        if (!updatedBooking) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Booking not found", error: true })
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Booking updated successfully", error: false })
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: true })
        }
    }
}

export const deleteBooking = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters || {};
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Booking ID is required", error: true })
        }
    }
    try {
        const deletedBooking = await Bookings.findByIdAndDelete(id);
        if (!deletedBooking) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Booking not found", error: true })
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Booking deleted successfully", error: false })
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: true })
        }
    }
}


export const createPaymentIntent = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { amount, currency = "inr", metadata } = JSON.parse(event.body || '{}');
        const description = `Hotel booking for ${metadata?.userId} at ${metadata?.hotelName || "hotel"} from ${metadata?.checkIn?.split("T")[0] || ""} to ${metadata?.checkOut?.split("T")[0] || ""}`;
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            description,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                error: false
            })
        }
    } catch (error) {
        console.error("Error creating payment intent:", error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error",
                error: true
            })
        }
    }
}


