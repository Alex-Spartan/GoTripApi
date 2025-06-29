const express = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists", error: true });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            method: 'email',
        });

        await user.save();

        res.status(201).json({ message: "User created", error: false, user: {
            fullName: user.fullName,
            email: user.email,
            method: user.method,
            _id: user._id,
        } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, method: 'email' });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials", error: true });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials", error: true });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token).status(200).json({
            message: "Login successful",
            error: false,
            token,
            user: {
                fullName: user.fullName,
                email: user.email,
                method: user.method,
                _id: user._id,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
    }
});

// Google Login
router.post('/google-login', async (req, res) => {
    try {
        const { email, fullName, uid } = req.body;
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
            res.status(200).json({
                message: "Login successful",
                error: false,
                user,
                token
            });
        } else {
            res.status(200).json({
                message: "User already exists",
                error: false,
                user: user,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: true });
    }
});

router.get('/profile', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            jwt.verify(token, process.env.JWT_KEY, {}, async (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (!data) return res.status(401).json("Unauthorized");
                const user = await User.findById(data._id);
                res.status(200).json(user);
            })
        } else {
            res.json(null)
        }
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;