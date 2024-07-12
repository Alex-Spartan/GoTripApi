const { Router } = require('express');
const Accomodation = require('../models/Accomodation')
const User = require("../models/User")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = Router();


router.post('/roomBooking/:placeId', async (req, res) => {
    const { placeId } = req.params;
    const guestData = req.body;
    try {
        const data = await Accomodation.findById(placeId);
        data.guests.push(guestData);
        await data.save();
        res.json({ message: "booking created" });
    } catch (err) {
        res.status(500).json(err);
    }
})


router.post('/userBooking/:userId', async (req, res) => {
    const { userId } = req.params;
    const bookingData = req.body;
    try {
        const data = await User.findById(userId);
        data.bookings.push(bookingData);
        await data.save();
        res.json({ message: "booking created" });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/create-checkout-session', async (req, res) => {
    YOUR_DOMAIN = 'http://localhost:3000/booking'
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

    res.json({ id: session.id});
});

router.get('/user/:id', async ( req, res) => {
    const { id } = req.params;
    try {
        const data = await User.findById(id);
        res.json(data.bookings);
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;