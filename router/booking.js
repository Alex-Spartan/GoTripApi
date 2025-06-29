const { Router } = require('express');
const Accomodation = require('../models/Accomodation')
const User = require("../models/User");
const Bookings = require('../models/Bookings');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = Router();


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "User ID is required", error: true });
    }
    try {
        const bookings = await Bookings.find({ userId: id })
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user", error: true });
        }
        res.status(200).json({ message: "Booking found", error: false, bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: true });
    }
});

router.post('/', async (req, res) => {
    const data = req.body;
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
        return res.status(400).json({ message: "All fields are required", error: true });
    }
    const booking = new Bookings({
        ...data,
    });
    await booking.save()
    return res.status(201).json({ message: "Booking created successfully", error: false });
})


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const bookingData = req.body;
    try {
        const updatedBooking = await Bookings.findByIdAndUpdate(id, bookingData);
        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found", error: true });
        }
        res.status(200).json({ message: "Booking updated successfully", error: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: true });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBooking = await Bookings.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found", error: true });
        }
        res.status(200).json({ message: "Booking deleted successfully", error: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: true });
    }
})


router.post('/create-payment-intent', async (req, res) => {
    YOUR_DOMAIN = 'https://gotrip-virid.vercel.app//booking'
    try {
        const { amount, currency = "inr", metadata } = req.body;
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

        return res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        })
    } catch (error) {
        console.error("Error creating payment intent:", error)
        return res.status(500).json({ error: "Failed to create payment intent" })
    }
});



module.exports = router;