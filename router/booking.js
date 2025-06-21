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
        const bookings = await Bookings.find({ userId: id }).populate('hotelId', 'title address images');
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
        !data.checkInDate ||
        !data.checkOutDate ||
        !data.rooms ||
        !data.totalAmount) {
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


router.post('/create-checkout-session', async (req, res) => {
    YOUR_DOMAIN = 'https://gotrip-virid.vercel.app//booking'
    const { price } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Hotel Booking',
                    },
                    unit_amount: price * 100,
                },
                quantity: 1,
            },
        ],

        mode: 'payment',
        billing_address_collection: 'required',
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/cancelled`,
    });

    res.json({ id: session.id });
});



module.exports = router;